package entity

import (
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

/*DB is connected database object*/
var DB *gorm.DB

func Setup() {

	dsn := "host=localhost user=shoper password=shoper@123 dbname=shopper port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatal(err)
	}

	db.AutoMigrate(&Item{})
	db.AutoMigrate(&Cart{})
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Order{})
	DB = db
}

// GetDB helps you to get a connection
func GetDB() *gorm.DB {
	return DB
}
