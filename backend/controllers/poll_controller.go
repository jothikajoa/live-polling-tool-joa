package controllers

import (
	"context"
	"errors"
	"live-polling-backend/config"
	"live-polling-backend/middleware"
	"live-polling-backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// CreatePoll creates a new poll
func CreatePoll(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req models.CreatePollRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate options
	if len(req.Options) < 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Poll must have at least 2 options"})
		return
	}

	// Initialize vote counts
	for i := range req.Options {
		req.Options[i].Votes = 0
	}

	poll := models.Poll{
		ID:          primitive.NewObjectID(),
		UserID:      userID,
		Question:    req.Question,
		Description: req.Description,
		Options:     req.Options,
		Status:      "active",
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	pollsCollection := config.GetPollsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = pollsCollection.InsertOne(ctx, poll)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create poll"})
		return
	}

	c.JSON(http.StatusCreated, poll)
}

// GetAllPolls retrieves all polls
func GetAllPolls(c *gin.Context) {
	pollsCollection := config.GetPollsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := pollsCollection.Find(ctx, bson.M{}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch polls"})
		return
	}
	defer cursor.Close(ctx)

	var polls []models.Poll
	if err := cursor.All(ctx, &polls); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse polls"})
		return
	}

	if polls == nil {
		polls = []models.Poll{}
	}

	c.JSON(http.StatusOK, polls)
}

// GetUserPolls retrieves polls created by the current user
func GetUserPolls(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	pollsCollection := config.GetPollsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"created_at": -1})
	cursor, err := pollsCollection.Find(ctx, bson.M{"user_id": userID}, opts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch polls"})
		return
	}
	defer cursor.Close(ctx)

	var polls []models.Poll
	if err := cursor.All(ctx, &polls); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse polls"})
		return
	}

	if polls == nil {
		polls = []models.Poll{}
	}

	c.JSON(http.StatusOK, polls)
}

// GetPollByID retrieves a single poll by ID
func GetPollByID(c *gin.Context) {
	pollID := c.Param("id")

	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid poll ID"})
		return
	}

	pollsCollection := config.GetPollsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var poll models.Poll
	err = pollsCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	c.JSON(http.StatusOK, poll)
}

// GetPollResults retrieves the current poll results.
func GetPollResults(c *gin.Context) {
	pollID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid poll ID"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var poll models.Poll
	err = config.GetPollsCollection().FindOne(ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	totalVotes := 0
	for _, option := range poll.Options {
		totalVotes += option.Votes
	}

	c.JSON(http.StatusOK, models.PollResponse{
		ID: poll.ID.Hex(), Question: poll.Question, Description: poll.Description,
		Options: poll.Options, Status: poll.Status, CreatedAt: poll.CreatedAt,
		UpdatedAt: poll.UpdatedAt, TotalVotes: totalVotes,
	})
}

// DeletePoll deletes a poll by ID
func DeletePoll(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	pollID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid poll ID"})
		return
	}

	pollsCollection := config.GetPollsCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if poll belongs to user
	var poll models.Poll
	err = pollsCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	if poll.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You don't have permission to delete this poll"})
		return
	}

	result, err := pollsCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete poll"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Poll deleted successfully"})
}

// Vote records a vote on a poll
func Vote(c *gin.Context) {
	userID, err := middleware.GetUserID(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	pollID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(pollID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid poll ID"})
		return
	}

	var req models.VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pollsCollection := config.GetPollsCollection()
	votesCollection := config.GetVotesCollection()
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check if user already voted
	var existingVote models.UserVote
	err = votesCollection.FindOne(ctx, bson.M{"user_id": userID, "poll_id": objID}).Decode(&existingVote)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You have already voted on this poll"})
		return
	}
	if !errors.Is(err, mongo.ErrNoDocuments) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check existing vote"})
		return
	}

	// Get the poll
	var poll models.Poll
	err = pollsCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Poll not found"})
		return
	}

	// Validate option index
	if req.OptionIndex < 0 || req.OptionIndex >= len(poll.Options) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid option index"})
		return
	}

	// Record the vote
	vote := models.UserVote{
		ID:       primitive.NewObjectID(),
		UserID:   userID,
		PollID:   objID,
		OptionID: req.OptionIndex,
		VotedAt:  time.Now(),
	}

	_, err = votesCollection.InsertOne(ctx, vote)
	if err != nil {
		// The unique index protects against concurrent duplicate votes.
		c.JSON(http.StatusBadRequest, gin.H{"error": "You have already voted on this poll"})
		return
	}

	// Update vote count
	_, err = pollsCollection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		bson.M{"$inc": bson.M{"options." + strconv.Itoa(req.OptionIndex) + ".votes": 1}},
	)
	if err != nil {
		// Keep the vote record and counter consistent if the counter update fails.
		_, _ = votesCollection.DeleteOne(ctx, bson.M{"_id": vote.ID})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update poll"})
		return
	}

	// Get updated poll
	err = pollsCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&poll)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch updated poll"})
		return
	}

	c.JSON(http.StatusOK, poll)
}
