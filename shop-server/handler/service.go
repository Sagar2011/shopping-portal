package handler

import (
	"fmt"
	"net/http"
	"shop-server/entity"
	"strconv"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type APIEnv struct {
	DB *gorm.DB
}

type ItemOutput struct {
	Items []entity.Item
	Total int64
}

var ACCESS_SECRET = "@shopper#3245"

func CreateToken(username string) (string, error) {
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["userid"] = username
	atClaims["exp"] = time.Now().Add(time.Minute * 15).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(ACCESS_SECRET))
	if err != nil {
		return "", err
	}
	return token, nil
}

func VerifyToken(tokenString string) (*jwt.Token, error) {
	// os.Setenv("ACCESS_SECRET", "@shopper#3245")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		//Make sure that the token method conform to "SigningMethodHMAC"
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(ACCESS_SECRET), nil
	})
	fmt.Println(err)
	if err != nil {
		return nil, err
	}
	return token, nil
}

func ClaimToken(tokenString string) (string, error) {
	claims := jwt.MapClaims{}
	token, _ := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte("<YOUR VERIFICATION KEY>"), nil
	})
	if token != nil {
		for key, val := range claims {
			if key == "userid" {
				return fmt.Sprint(val), nil
			}
		}
	}
	return "", nil
}

func checkTokenExistValid(c *gin.Context) (bool, string) {
	token := c.Request.Header["Authorization"]
	if len(token) > 0 {
		token := strings.Split(token[0], " ")[1]
		tok, _ := VerifyToken(token)
		claim, _ := ClaimToken(token)
		if tok != nil {
			return true, claim
		} else {
			return false, ""
		}
	}
	return false, ""
}

func (a *APIEnv) VerifyUser(c *gin.Context) {
	var u entity.User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
		return
	}
	user, found, err := entity.GetUserByEmail(u.Username, a.DB)
	//compare the user from the request, with the one we defined:
	if user.Username != u.Username || user.Password != u.Password {
		c.JSON(http.StatusUnauthorized, "Please provide valid login details")
		return
	} else if !found {
		c.JSON(http.StatusUnauthorized, err)
		return
	}

	token, err := CreateToken(user.Username)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, err.Error())
		return
	}
	c.JSON(http.StatusOK, token)
}

func (a *APIEnv) RegsiterUser(c *gin.Context) {
	var u entity.User
	if err := c.ShouldBindJSON(&u); err != nil {
		c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
		return
	}
	_, found, err := entity.GetUserByEmail(u.Username, a.DB)
	if found {
		c.JSON(http.StatusOK, "used")
		return
	} else if !found {
		done, er := entity.CreateUser(u.Username, u.Password, a.DB)
		if done {
			a.VerifyUser(c)
		} else {
			c.JSON(http.StatusInternalServerError, er)
			return
		}
	}
	c.JSON(http.StatusUnauthorized, err)
}

func (a *APIEnv) GetItems(c *gin.Context) {
	offSet := c.Query("offSet")
	validToken, _ := checkTokenExistValid(c)
	if validToken {
		off, _ := strconv.Atoi(offSet)
		users, total, err := entity.GetItems(a.DB, off)
		out := ItemOutput{
			Items: users,
			Total: total,
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}
		c.JSON(http.StatusOK, out)
		return
	}
	c.JSON(http.StatusForbidden, "ForBidden")
}

func (a *APIEnv) GetCarts(c *gin.Context) {
	validToken, claim := checkTokenExistValid(c)
	if validToken {
		email := claim
		users, err := entity.GetCarts(a.DB, email)
		if err != nil {
			if err.Error() == "record not found" {
				c.JSON(http.StatusOK, users)
				return
			}
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, users)
		return
	}
	c.JSON(http.StatusForbidden, "ForBidden")
}

func (a *APIEnv) UpdateCarts(c *gin.Context) {
	validToken, claim := checkTokenExistValid(c)
	cartId := c.Query("cart")
	if validToken {
		email := claim
		cartid, _ := strconv.ParseInt(cartId, 10, 64)
		err := entity.UpdateCart(a.DB, email, cartid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, "OK!")
		return
	}
	c.JSON(http.StatusForbidden, "ForBidden")
}

func (a *APIEnv) OrderCarts(c *gin.Context) {
	validToken, claim := checkTokenExistValid(c)
	if validToken {
		email := claim
		err := entity.OrderCart(a.DB, email)
		if err != nil {
			if err.Error() == "record not found" {
				c.JSON(http.StatusNotFound, "OK!")
				return
			}
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, "OK!")
		return
	}
	c.JSON(http.StatusForbidden, "ForBidden")
}

func (a *APIEnv) OrderHistory(c *gin.Context) {
	validToken, claim := checkTokenExistValid(c)
	if validToken {
		email := claim
		orders, err := entity.OrderHistory(a.DB, email)
		if err != nil {
			if err.Error() == "record not found" {
				c.JSON(http.StatusOK, "OK!")
				return
			}
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, orders)
		return
	}
	c.JSON(http.StatusForbidden, "ForBidden")
}
