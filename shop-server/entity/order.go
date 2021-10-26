package entity

import (
	"gorm.io/gorm"
)

type Order struct {
	gorm.Model
	CartId   int
	Username string
	Cart     Cart `gorm:"ForeignKey:CartId;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	User     User `gorm:"ForeignKey:Username;references:Username;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}
