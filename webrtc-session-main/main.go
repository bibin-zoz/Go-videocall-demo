package main

import (
	// Replace with the correct path to the server package

	"video-chat-app/server"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Allow CORS
	r.Use(cors.Default())

	server.AllRooms.Init()

	r.POST("/create", server.CreateRoomRequestHandler)
	r.GET("/join", server.JoinRoomRequestHandler)

	r.Run(":8000")
}
