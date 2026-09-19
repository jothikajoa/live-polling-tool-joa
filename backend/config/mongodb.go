package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoDB *mongo.Client
var Database *mongo.Database

// InitMongoDB initializes the MongoDB connection
func InitMongoDB() error {
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return err
	}

	// Verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		_ = client.Disconnect(context.Background())
		return err
	}

	MongoDB = client
	dbName := os.Getenv("MONGODB_DATABASE")
	if dbName == "" {
		dbName = "polling_db"
	}

	Database = client.Database(dbName)

	// Prevent the same user from voting on the same poll more than once.
	_, err = GetVotesCollection().Indexes().CreateOne(ctx, mongo.IndexModel{
		Keys:    bson.D{{Key: "user_id", Value: 1}, {Key: "poll_id", Value: 1}},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		_ = client.Disconnect(context.Background())
		return fmt.Errorf("failed to create vote index: %w", err)
	}

	log.Println("✓ MongoDB connected successfully")
	return nil
}

// CloseMongoDB closes the MongoDB connection
func CloseMongoDB() error {
	if MongoDB == nil {
		return fmt.Errorf("MongoDB client is nil")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	return MongoDB.Disconnect(ctx)
}

// GetUsersCollection returns the users collection
func GetUsersCollection() *mongo.Collection {
	return Database.Collection("users")
}

// GetPollsCollection returns the polls collection
func GetPollsCollection() *mongo.Collection {
	return Database.Collection("polls")
}

// GetVotesCollection returns the votes collection
func GetVotesCollection() *mongo.Collection {
	return Database.Collection("votes")
}
