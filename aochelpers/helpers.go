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

func AbsInt(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
