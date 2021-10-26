package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Username string `json:"username"`
	Password string `json:"password"`
}
