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

func Part1(){
	parsed := parseInput()
	var result int
	for _, line := range parsed {
		isSafe := true
		var increaseCount, decreaseCount int
		for i := 0; i < len(line)-1; i++ {
			diff := line[i+1] - line[i]
			if aochelpers.AbsInt(diff) >= 4 {
				isSafe = false
				break
			}
			//tu by można było zoptymalizować żeby przerywać szybciej pętlę
			if(diff > 0){
				increaseCount++
			} else if(diff < 0){
				decreaseCount++
			}
		}
		if(isSafe && (increaseCount == len(line) -1 || decreaseCount == len(line) -1)){
			result++
		}
	}
	fmt.Println(result)
}

func Part2(){

}