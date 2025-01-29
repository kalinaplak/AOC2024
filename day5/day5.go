package day5

import (
	"aoc2024/aochelpers"
	"strings"
	"math"
	"fmt"
	"sort"
)

type MappedInput struct {
	Rules   map[int][]int
	Numbers [][]int
}

func parseRules(rules string) map[int][]int{
	ruleMap := make(map[int][]int)
	for _, ruleLine := range strings.Split(rules, "\n") {
		ruleParts := strings.Split(ruleLine, "|")
		key := aochelpers.ParseInt(strings.TrimSpace(ruleParts[0]))
		value := aochelpers.ParseInt(strings.TrimSpace(ruleParts[1]))
		ruleMap[key] = append(ruleMap[key], value)
	}
	return ruleMap
}

func parseNumbers(numbers string) [][]int{
	var numberList [][]int
	for _, numberLine := range strings.Split(numbers, "\n") {
		numberParts := strings.Split(numberLine, ",")
		var numbersRow []int
		for _, numStr := range numberParts {
			num := aochelpers.ParseInt(strings.TrimSpace(numStr))
			numbersRow = append(numbersRow, num)
		}
		numberList = append(numberList, numbersRow)
	}
	return numberList
}

func parseInput(input string) MappedInput{
	parts := strings.Split(input, "\n\n")
	ruleMap := parseRules(parts[0])
	numberList := parseNumbers(parts[1])

	return MappedInput{
		Rules:   ruleMap,
		Numbers: numberList,
	}
}

func isFulfilledRule(row, rule []int, index int) bool{
	for i := 0; i < index; i++ {
		for _, rNum := range rule {
			if(row[i] == rNum){
				return false
			}
		}
	}
	return true
}

func isCorrectPage(page []int, rules map[int][]int, part2 bool) bool {
	for i, num := range page {
		rule, exists := rules[num]
		if exists {
			fulfilled := isFulfilledRule(page, rule, i)
			if !fulfilled {
				return false
			}
		}
	}
	return true
}

func sortPageCorrectly(page []int, rules map[int][]int) {
	sort.Slice(page, func(i, j int) bool {
		rule, exists := rules[i]
		if !exists {
			return true
		}
		for _, n := range rule {
			if n == j {
				return false
			}
		}
		return true
	})
}

func getMiddleIndexValue(page []int) int {
	middleIndex := int(math.Round(float64(len(page)-1) / 2))
	return page[middleIndex]
}

func calculateResult(numbers [][]int, rules map[int][]int, part2 bool) int {
	result := 0
	for _, page := range numbers {
		isCorrect := isCorrectPage(page, rules, part2)
		if isCorrect {
			if(!part2){
				result += getMiddleIndexValue(page)
			}
		} else if(part2){
			//tutaj pomysł od MN
			sortPageCorrectly(page, rules)
			result += getMiddleIndexValue(page)
		}
	}
	return result
}

func Part1() {
	input := parseInput(aochelpers.ReadFileAsString("./day5/input.txt"))
	result := calculateResult(input.Numbers, input.Rules, false)

	fmt.Println("Day 5, part 1:", result)
}

func Part2() {
	input := parseInput(aochelpers.ReadFileAsString("./day5/input.txt"))
	result := calculateResult(input.Numbers, input.Rules, true)

	fmt.Println("Day 5, part 2:", result)
}


