 package main

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Option struct {
	ID    string `json:"id" bson:"id"`
	Text  string `json:"text" bson:"text"`
	Votes int    `json:"votes" bson:"votes"`
}

type Poll struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Question  string             `json:"question" bson:"question"`
	Options   []Option           `json:"options" bson:"options"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
}

var (
	mongoClient    *mongo.Client
	pollCollection *mongo.Collection
	rdb            *redis.Client
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// MongoDB
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	var err error

	mongoClient, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		panic(err)
	}

	if err = mongoClient.Ping(ctx, nil); err != nil {
		panic(err)
	}

	pollCollection = mongoClient.
		Database("live_polling").
		Collection("polls")

	// Redis
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	rdb = redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	if err = rdb.Ping(context.Background()).Err(); err != nil {
		panic(err)
	}

	// Gin
	router := gin.Default()

	// CORS
	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set(
			"Access-Control-Allow-Origin",
			"http://localhost:5173",
		)

		c.Writer.Header().Set(
			"Access-Control-Allow-Credentials",
			"true",
		)

		c.Writer.Header().Set(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization",
		)

		c.Writer.Header().Set(
			"Access-Control-Allow-Methods",
			"GET, POST, OPTIONS",
		)

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	})

	// Home
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Live Polling Backend is running!",
		})
	})

	// Health
	router.GET("/health", func(c *gin.Context) {
		redisStatus := "connected"
		mongoStatus := "connected"

		if err := rdb.Ping(context.Background()).Err(); err != nil {
			redisStatus = "disconnected"
		}

		if err := mongoClient.Ping(context.Background(), nil); err != nil {
			mongoStatus = "disconnected"
		}

		c.JSON(http.StatusOK, gin.H{
			"backend": "ok",
			"redis":   redisStatus,
			"mongodb": mongoStatus,
		})
	})

	// Public routes
	router.GET("/api/polls/:id", getPoll)

	router.POST(
		"/api/polls/:id/vote/:optionId",
		votePoll,
	)

	router.GET(
		"/ws/:id",
		websocketHandler,
	)

	// Protected route
	auth := router.Group("/api")

	auth.Use(gin.BasicAuth(gin.Accounts{
		"admin": "poll123",
	}))

	auth.POST("/polls", createPoll)

	// Render port
	port := os.Getenv("PORT")
	if port == "" {
		port = "10000"
	}

	router.Run("0.0.0.0:" + port)
}

// =====================================================
// CREATE POLL
// =====================================================

func createPoll(c *gin.Context) {
	var request struct {
		Question string   `json:"question"`
		Options  []string `json:"options"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request",
		})
		return
	}

	if len(request.Question) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Question must contain at least 3 characters",
		})
		return
	}

	if len(request.Options) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "At least 2 options are required",
		})
		return
	}

	optionsList := make([]Option, 0)

	for _, text := range request.Options {
		if text == "" {
			continue
		}

		optionsList = append(optionsList, Option{
			ID:    primitive.NewObjectID().Hex(),
			Text:  text,
			Votes: 0,
		})
	}

	if len(optionsList) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "At least 2 valid options are required",
		})
		return
	}

	poll := Poll{
		Question:  request.Question,
		Options:   optionsList,
		CreatedAt: time.Now(),
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	result, err := pollCollection.InsertOne(ctx, poll)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create poll",
		})
		return
	}

	poll.ID = result.InsertedID.(primitive.ObjectID)

	c.JSON(http.StatusCreated, gin.H{
		"message": "Poll created successfully",
		"poll":    poll,
	})
}

// =====================================================
// GET POLL
// =====================================================

func getPoll(c *gin.Context) {
	id := c.Param("id")

	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid poll ID",
		})
		return
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	var poll Poll

	err = pollCollection.FindOne(
		ctx,
		bson.M{
			"_id": objectID,
		},
	).Decode(&poll)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Poll not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get poll",
		})
		return
	}

	c.JSON(http.StatusOK, poll)
}

// =====================================================
// VOTE
// =====================================================

func votePoll(c *gin.Context) {
	pollID := c.Param("id")
	optionID := c.Param("optionId")

	objectID, err := primitive.ObjectIDFromHex(pollID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid poll ID",
		})
		return
	}

	ctx, cancel := context.WithTimeout(
		context.Background(),
		10*time.Second,
	)
	defer cancel()

	var poll Poll

	err = pollCollection.FindOne(
		ctx,
		bson.M{
			"_id": objectID,
		},
	).Decode(&poll)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Poll not found",
		})
		return
	}

	optionFound := false

	for i := range poll.Options {
		if poll.Options[i].ID == optionID {
			poll.Options[i].Votes++
			optionFound = true
			break
		}
	}

	if !optionFound {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Option not found",
		})
		return
	}

	_, err = pollCollection.UpdateOne(
		ctx,
		bson.M{
			"_id": objectID,
		},
		bson.M{
			"$set": bson.M{
				"options": poll.Options,
			},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update vote",
		})
		return
	}

	// Redis realtime update
	channel := "poll:" + pollID

	data, err := json.Marshal(poll)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to prepare realtime update",
		})
		return
	}

	err = rdb.Publish(
		context.Background(),
		channel,
		string(data),
	).Err()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to publish realtime update",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Vote recorded successfully",
		"poll":    poll,
	})
}

// =====================================================
// WEBSOCKET
// =====================================================

func websocketHandler(c *gin.Context) {
	pollID := c.Param("id")

	conn, err := upgrader.Upgrade(
		c.Writer,
		c.Request,
		nil,
	)

	if err != nil {
		return
	}

	defer conn.Close()

	channel := "poll:" + pollID

	pubsub := rdb.Subscribe(
		context.Background(),
		channel,
	)

	defer pubsub.Close()

	// Send current poll immediately
	objectID, err := primitive.ObjectIDFromHex(pollID)

	if err == nil {
		var poll Poll

		err = pollCollection.FindOne(
			context.Background(),
			bson.M{
				"_id": objectID,
			},
		).Decode(&poll)

		if err == nil {
			data, err := json.Marshal(poll)

			if err == nil {
				_ = conn.WriteMessage(
					websocket.TextMessage,
					data,
				)
			}
		}
	}

	// Listen for Redis updates
	for {
		message, err := pubsub.ReceiveMessage(
			context.Background(),
		)

		if err != nil {
			break
		}

		err = conn.WriteMessage(
			websocket.TextMessage,
			[]byte(message.Payload),
		)

		if err != nil {
			break
		}
	}
}