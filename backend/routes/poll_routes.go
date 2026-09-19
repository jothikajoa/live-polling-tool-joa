package routes

import (
	"live-polling-backend/controllers"
	"live-polling-backend/middleware"

	"github.com/gin-gonic/gin"
)

// SetupPollRoutes sets up poll routes
func SetupPollRoutes(router *gin.Engine) {
	// Public routes
	pollGroup := router.Group("/api/polls")
	{
		// Get all polls
		pollGroup.GET("", controllers.GetAllPolls)
		// Get poll by ID
		pollGroup.GET("/:id", controllers.GetPollByID)
		pollGroup.GET("/:id/results", controllers.GetPollResults)
	}

	// Protected routes
	protectedGroup := router.Group("/api/polls")
	protectedGroup.Use(middleware.AuthMiddleware())
	{
		// Create poll
		protectedGroup.POST("", controllers.CreatePoll)
		// Get user's polls
		protectedGroup.GET("/user/my-polls", controllers.GetUserPolls)
		// Vote on poll
		protectedGroup.POST("/:id/vote", controllers.Vote)
		// Delete poll
		protectedGroup.DELETE("/:id", controllers.DeletePoll)
	}
}
