package main

import (
	"encoding/json"
	"fmt"

	amqp "github.com/oarkflow/garagemq/amqp091"

	"github.com/oarkflow/garagemq/examples/utils"
)

func main() {
	utils.Init()
	err := utils.Ch.ExchangeDeclare(utils.Exchange, amqp.ExchangeTopic, true, false, false, false, nil)
	utils.FailOnError(err, "Failed to declare the Exchange")

	q, err := utils.Ch.QueueDeclare("test-queue-name", true, false, false, false, nil)
	utils.FailOnError(err, "Error declaring the Queue")

	err = utils.Ch.QueueBind(q.Name, utils.ConsumerKey, utils.Exchange, false, nil)
	utils.FailOnError(err, "Error binding to the Queue")

	replies, err := utils.Ch.Consume(q.Name, utils.ConsumerName, true, false, false, false, nil)
	utils.FailOnError(err, "Error consuming the Queue")

	for r := range replies {
		var user utils.User
		json.Unmarshal(r.Body, &user)
		fmt.Printf("FirstName: %s, LastName: %s\n", user.FirstName, user.LastName)
	}
}
