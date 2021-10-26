package entity

import (
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type Cart struct {
	gorm.Model
	Items        pq.Int64Array `gorm:"type:integer[]"`
	Username     string        `gorm:"unique"`
	Is_purchased bool
	User         User `gorm:"foreignKey:Username;references:Username"`
}
