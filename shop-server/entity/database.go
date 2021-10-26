package entity

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type CartItem struct {
	ItemId int64
	Name   string
}

func removeDuplicateValues(intSlice []int64) []int64 {
	keys := make(map[int64]bool)
	list := []int64{}

	for _, entry := range intSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func CreateUser(email string, password string, db *gorm.DB) (bool, error) {
	_ = db.Model(&Cart{}).Save(Cart{Username: email, Is_purchased: false})
	err := db.Model(&User{}).Save(User{Username: email, Password: password})
	if err != nil {
		return false, err.Error
	}
	return true, nil
}

func GetUserByEmail(email string, db *gorm.DB) (User, bool, error) {
	b := User{}

	query := db.Select("*")
	err := query.Where("users.username = ?", email).First(&b).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return b, false, err
	}

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return b, false, nil
	}
	return b, true, nil
}

func GetItems(db *gorm.DB, offSet int) ([]Item, int64, error) {
	items := []Item{}
	query := db.Select("*").Offset(offSet).Limit(36)
	if err := query.Find(&items).Error; err != nil {
		return items, 0, err
	}
	var count int64
	db.Model(&items).Count(&count)
	return items, count, nil
}

func GetCarts(db *gorm.DB, username string) ([]CartItem, error) {
	carts := Cart{}
	query := db.Select("*").Where("carts.username = ?", username)
	if err := query.Find(&carts).Error; err != nil {
		return nil, err
	}
	var arrayCartItem []CartItem
	for i := 0; i < len(carts.Items); i++ {
		items := Item{}
		itemQuery := db.Select("items.name").Where("items.id = ?", carts.Items[i]).Find(&items)
		fmt.Println(itemQuery)
		cartItem := CartItem{
			ItemId: carts.Items[i],
			Name:   items.Name,
		}
		arrayCartItem = append(arrayCartItem, cartItem)
	}
	return arrayCartItem, nil
}

func UpdateCart(db *gorm.DB, username string, id int64) error {
	carts, _ := GetCarts(db, username)
	fmt.Println("car", carts)
	var Vcarts []int64
	for _, v := range carts {
		Vcarts = append(Vcarts, v.ItemId)
	}
	Vcarts = append(Vcarts, id)
	Vcarts = removeDuplicateValues(Vcarts)
	fmt.Println("v", Vcarts)
	err := db.Model(&Cart{}).Where("carts.username = ?", username).Updates(Cart{Items: Vcarts, Is_purchased: false})
	if err.Error != nil {
		return err.Error
	}
	return nil
}

func OrderCart(db *gorm.DB, username string) error {
	cart := Cart{}
	carts := db.Select("*").Where("carts.username = ?", username).Where("carts.is_purchased = ?", false).Find(&cart)
	if carts.RowsAffected == 1 {
		order := Order{CartId: int(cart.ID), Username: username}
		err := db.Model(&Order{}).Save(&order)
		_ = db.Model(&Cart{}).Where("carts.username = ?", username).Updates(Cart{Is_purchased: true, Items: nil})
		if err.Error != nil {
			return err.Error
		}
		return nil
	} else {
		return gorm.ErrRecordNotFound
	}
}

func OrderHistory(db *gorm.DB, username string) ([]Order, error) {
	orders := []Order{}
	query := db.Select("*").Where("orders.username", username)
	if err := query.Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}
