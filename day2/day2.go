package day2

import (
	"aoc2024/aochelpers"
	"fmt"
	"strings"
)

func parseInput() [][] int{
	file := aochelpers.ReadFileAsString("./day2/input.txt")
	content := strings.Split(string(file), "\n")
	var result [][]int
	for _, line := range content {
		splited := strings.Split(line, " ")
		var intline []int
		for _, num:= range splited {
			intline = append(intline, aochelpers.ParseInt(num))
		}
		result = append(result, intline)
	}
	return result
}


func processSingleLine(line []int, skipIndex int) bool {
	isSafe := true
	var increaseCount, decreaseCount int
	for i := 0; i < len(line)-1; i++ {
		if(skipIndex == -1 || i != skipIndex){
			nextIndex := aochelpers.Ternary(skipIndex == i + 1 && i + 2 < len(line), i + 2, i + 1).(int)
			if(nextIndex != skipIndex){
				diff := line[nextIndex] - line[i]
				if aochelpers.AbsInt(diff) >= 4 {
					isSafe = false
					break
				}
				if diff > 0 {
					increaseCount++
				} else if diff < 0 {
					decreaseCount++
				}
			}
		}
	}
	skipped := aochelpers.Ternary(skipIndex == -1, 0, 1).(int)
	if(increaseCount != len(line) -1 - skipped && decreaseCount != len(line) -1 - skipped){
		isSafe = false
	}
	return isSafe
}

func getCorrectLines(parsed [][]int, allowSingleMistake bool) int{
	var result int
	for _, line := range parsed {
		isSafe := processSingleLine(line, -1)
		if(isSafe){
			result++
		} else if allowSingleMistake {
			for i :=0; i < len(line); i++ {
				isSafe = processSingleLine(line, i)
				if(isSafe){
					result++
					break
				}
			}
		}
	}
	return result
}

func Part1(){
	parsed := parseInput()
	fmt.Println("Day 2, part 1: ", getCorrectLines(parsed, false))
}

func Part2(){
	parsed := parseInput()
	fmt.Println("Day 2, part 2: ", getCorrectLines(parsed, true))
}