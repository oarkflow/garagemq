package main

import (
	"encoding/json"
	"fmt"

	amqp "github.com/oarkflow/garagemq/amqp091"

	"github.com/oarkflow/garagemq/examples/utils"
)

func main() {
	utils.Init()
	err := utils.Ch.ExchangeDeclare(utils.Exchange2, amqp.ExchangeDirect, true, false, false, false, nil)
	utils.FailOnError(err, "Failed to declare the Exchange")

	q, err := utils.Ch.QueueDeclare("test-queue-name", true, false, false, false, nil)
	utils.FailOnError(err, "Error declaring the Queue")

	err = utils.Ch.QueueBind(q.Name, "abc.info", utils.Exchange2, false, nil)
	utils.FailOnError(err, "Error binding to the Queue")
	err = utils.Ch.Qos(100, 10, true)
	utils.FailOnError(err, "Error on Qos")
	replies, err := utils.Ch.Consume(q.Name, "backup-consumer", true, false, false, false, nil)
	utils.FailOnError(err, "Error consuming the Queue")

	for r := range replies {
		var user utils.User
		json.Unmarshal(r.Body, &user)
		fmt.Printf("FirstName: %s, LastName: %s\n", user.FirstName, user.LastName)
	}
}
