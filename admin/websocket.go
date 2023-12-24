package admin

import (
	"fmt"

	"github.com/oarkflow/frame"
	"github.com/oarkflow/log"
	"github.com/oarkflow/sio"
)

var (
	websocketServer *sio.Server
)

func NewWebsocket() {
	server := sio.New(sio.Config{
		CheckOrigin: func(r *frame.Context) bool {
			return true
		},
		EnableCompression: true,
	})
	websocketServer = server
	server.OnConnect(func(socket *sio.Socket) error {
		log.Warn().Str("id", socket.ID()).Msg("Websocket Connected")
		return nil
	})
	server.OnDisconnect(func(socket *sio.Socket) error {
		log.Warn().Str("id", socket.ID()).Msg("Websocket Disconnected")
		return nil
	})
	server.OnError(func(socket *sio.Socket, err error) {
		fmt.Println("Error", err.Error())
	})
	server.ShutdownWithSignal()
}
