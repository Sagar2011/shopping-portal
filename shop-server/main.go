package main

import (
	"log"
	"shop-server/controller"
	"shop-server/entity"
)

func main() {
	entity.Setup()
	r := controller.Setup()
	if err := r.Run("127.0.0.1:8080"); err != nil {
		log.Fatal(err)
	}
}
