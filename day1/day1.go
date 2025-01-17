package day1

import (
	"aoc2024/aochelpers"
	"fmt"
	"sort"
	"strings"
)

func parseInput() [][]int {
	file := aochelpers.ReadFileAsString("./day1/input.txt")
	content := strings.Split(string(file), "\n")
	var left, right []int
	for _, line := range content {
		splited := strings.Split(line, "   ")
		a, b := splited[0], splited[1]
		left = append(left, aochelpers.ParseInt(a))
		right = append(right, aochelpers.ParseInt(b))
	}
	return [][]int{left, right}
}

func Part1(){
	parsed := parseInput()
	left, right := parsed[0], parsed[1]
	sort.Ints(left)
	sort.Ints(right)
	var sum int
	for i := 0; i < len(left); i++ {
		sum = sum + aochelpers.AbsInt(left[i] - right[i])
	}
	fmt.Println(sum)
}

func Part2(){
	parsed := parseInput()
	left, right := parsed[0], parsed[1]
	var sum int
	for i := 0; i < len(left); i++ {
		var score int
		for _, num := range right{
			if(num == left[i]){
				score++
			}
		}
		sum = sum + (left[i] * score)
	}
	fmt.Println(sum)
}
