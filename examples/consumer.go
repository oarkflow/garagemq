package main

import (
	"encoding/json"
	"fmt"
	"log"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/valinurovam/garagemq/examples/utils"
)

var replies <-chan amqp.Delivery

func initConsumer() {
	var err error
	var q amqp.Queue

	q, err = utils.Ch.QueueDeclare("go-test-queue", true, false, false, false, nil)
	utils.FailOnError(err, "Error declaring the Queue")

	log.Printf("declared Queue (%q %d messages, %d consumers), binding to Exchange (key %q)",
		q.Name, q.Messages, q.Consumers, "go-test-key")

	err = utils.Ch.QueueBind(q.Name, "go-test-key", "go-test-exchange", false, nil)
	utils.FailOnError(err, "Error binding to the Queue")

	log.Printf("Queue bound to Exchange, starting Consume (consumer tag %q)", "go-amqp-example")

	replies, err = utils.Ch.Consume(q.Name, "go-amqp-example", true, false, false, false, nil)
	utils.FailOnError(err, "Error consuming the Queue")
}

func main() {
	utils.Init()
	initConsumer()
	log.Println("Start consuming the Queue...")
	var count = 1

	for r := range replies {
		if count == 10000 {
			log.Printf("Consuming reply number %d", count)

			user := utils.User{}
			json.Unmarshal(r.Body, &user)
			fmt.Printf("FirstName: %s, LastName: %s\n", user.FirstName, user.LastName)
		}
		count++
	}

}
