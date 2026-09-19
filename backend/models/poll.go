package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Option represents a voting option in a poll
type Option struct {
	Text  string `bson:"text" json:"text"`
	Emoji string `bson:"emoji" json:"emoji"`
	Votes int    `bson:"votes" json:"votes"`
}

// Poll represents a poll document in MongoDB
type Poll struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"userId"`
	Question    string             `bson:"question" json:"question" binding:"required"`
	Description string             `bson:"description" json:"description"`
	Options     []Option           `bson:"options" json:"options" binding:"required,min=2"`
	Status      string             `bson:"status" json:"status"` // active, closed
	CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
	ExpiresAt   *time.Time         `bson:"expires_at,omitempty" json:"expires_at,omitempty"`
}

// CreatePollRequest represents the request to create a new poll
type CreatePollRequest struct {
	Question    string   `json:"question" binding:"required"`
	Description string   `json:"description"`
	Options     []Option `json:"options" binding:"required,min=2"`
}

// VoteRequest represents a vote request
type VoteRequest struct {
	OptionIndex int `json:"optionIndex" binding:"min=0"`
}

// PollResponse represents a poll with calculated stats
type PollResponse struct {
	ID          string                 `json:"id"`
	Question    string                 `json:"question"`
	Description string                 `json:"description"`
	Options     []Option               `json:"options"`
	Status      string                 `json:"status"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
	TotalVotes  int                    `json:"totalVotes"`
	User        map[string]interface{} `json:"user,omitempty"`
}

// UserVote represents a user's vote on a poll
type UserVote struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID   primitive.ObjectID `bson:"user_id" json:"userId"`
	PollID   primitive.ObjectID `bson:"poll_id" json:"poll_id"`
	OptionID int                `bson:"option_id" json:"option_id"`
	VotedAt  time.Time          `bson:"voted_at" json:"voted_at"`
}
