package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"time"

	amqp "github.com/valinurovam/garagemq/amqp091"

	"github.com/valinurovam/garagemq/examples/utils"
)

func randomString(l int) string {
	bytes := make([]byte, l)
	for i := 0; i < l; i++ {
		bytes[i] = byte(randInt(65, 90))
	}
	return string(bytes)
}

func randInt(min int, max int) int {
	return min + rand.Intn(max-min)
}

func publishMessages(messages int) {
	for i := 0; i < messages; i++ {
		user := utils.User{
			FirstName: randomString(randInt(3, 10)),
			LastName:  randomString(randInt(3, 10)),
		}

		payload, _ := json.Marshal(user)
		err := utils.Ch.PublishWithContext(context.Background(), utils.Exchange, utils.PublishKey, false, false,
			amqp.Publishing{
				DeliveryMode: amqp.Persistent,
				ContentType:  "application/json",
				Body:         payload,
				Timestamp:    time.Now(),
			},
		)
		utils.FailOnError(err, "Failed to Publish on RabbitMQ")
	}
}

func main() {
	utils.Init()
	log.Println("Starting publisher...")
	publishMessages(10)
	defer utils.Ch.Close()
	defer utils.Conn.Close()
}
