package controller

import (
	"shop-server/entity"
	"shop-server/handler"

	"github.com/gin-gonic/gin"
)

func Setup() *gin.Engine {
	r := gin.Default()
	api := &handler.APIEnv{
		DB: entity.GetDB(),
	}

	r.POST("/shopper/auth/token", api.VerifyUser)
	r.POST("/shopper/user/register", api.RegsiterUser)
	r.GET("/shopper/item/list", api.GetItems)
	r.GET("/shopper/cart/list", api.GetCarts)
	r.GET("/shopper/cart/add", api.UpdateCarts)
	r.GET("/shopper/cart/complete", api.OrderCarts)
	r.GET("/shopper/order/list", api.OrderHistory)
	r.Run(":7000")
	return r
}
