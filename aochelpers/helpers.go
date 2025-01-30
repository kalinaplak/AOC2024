package aochelpers

import (
	"fmt"
	"os"
	"strconv"
)

func ReadFileAsString(path string) string {
	file, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("Error:", err)
		return ""
	}
	return string(file)
}

func ParseInt(s string) int {
	num, err := strconv.Atoi(s)
	if err != nil {
		fmt.Println("Error:", err)
	}
	return num
}

func ParseInt64(s string) int64 {
	num, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		fmt.Println("Error:", err)
	}
	return num
}


func AbsInt(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func Ternary(condition bool, trueVal, falseVal interface{}) interface{} {
	if condition {
			return trueVal
	}
	return falseVal
}