package entity

import (
	"gorm.io/gorm"
)

type Item struct {
	gorm.Model
	Name string
}