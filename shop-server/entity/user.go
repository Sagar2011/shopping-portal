package entity

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"type:text;unique"`
	Password string `json:"password"`
}
