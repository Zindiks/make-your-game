package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	server "score"
)

const port string = "8080"

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func reader(conn *websocket.Conn) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		log.Println(string(p))

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Panicln(err)
			return
		}

	}
}

func wsEndpoint(w http.ResponseWriter, r *http.Request) {

	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	ws, err := upgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
	}

	log.Println("Client Successfuly connected ")

	reader(ws)

}

func setupRoute() {
	http.HandleFunc("/", wsEndpoint)
}

func main() {
	setupRoute()

	srv := new(server.Server)

	err := srv.Run(port)

	if err != nil {
		log.Fatalf("error: %s", err.Error())

	}

}
