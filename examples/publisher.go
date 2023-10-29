package main

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

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
		user := utils.User{}
		user.FirstName = randomString(randInt(3, 10))
		user.LastName = randomString(randInt(3, 10))

		payload, err := json.Marshal(user)
		utils.FailOnError(err, "Failed to marshal JSON")

		err = utils.Ch.PublishWithContext(context.Background(), "go-test-exchange", "go-test-key", false, false,
			amqp.Publishing{
				DeliveryMode: amqp.Persistent,
				ContentType:  "application/json",
				Body:         payload,
				Timestamp:    time.Now(),
			})

		utils.FailOnError(err, "Failed to Publish on RabbitMQ")
	}
}

func main() {
	utils.Init()
	log.Println("Starting publisher...")

	publishMessages(10000)

	defer utils.Ch.Close()

	defer utils.Conn.Close()
}
