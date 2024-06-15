package main

import (
	// Replace with the correct path to the server package

	"net/http"
	"video-chat-app/server"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Allow CORS
	r.Use(cors.Default())
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	r.GET("/room/:roomID", func(c *gin.Context) {
		roomID := c.Param("roomID")
		c.HTML(http.StatusOK, "room.html", gin.H{"RoomID": roomID})
	})

	server.AllRooms.Init()

	r.POST("/create", server.CreateRoomRequestHandler)
	r.GET("/join", server.JoinRoomRequestHandler)

	r.Run(":8000")
}
