package day3

import (
	"aoc2024/aochelpers"
	"fmt"
	"regexp"
)

func parseInput() string{
	return aochelpers.ReadFileAsString("./day3/input.txt")
}

func Part1() {
	input := parseInput()
	validMulRegex := regexp.MustCompile(`mul\((\d+),(\d+)\)`)
	matches := validMulRegex.FindAllStringSubmatch(input, -1)

	sum := 0
	for _, match := range matches {
			num1:= aochelpers.ParseInt(match[1])
			num2 := aochelpers.ParseInt(match[2])
			sum += num1 * num2
	}

	fmt.Println("Day 3, part 1: ", sum)
}

func Part2() {
	input := parseInput()
	isEnabled := true
	validMulRegex := regexp.MustCompile(`(mul\((\d+),(\d+)\)|do\(\)|don't\(\))`)
	matches := validMulRegex.FindAllStringSubmatch(input, -1)

	sum := 0
	for _, match := range matches {
			fullMatch := match[0]
			mul := match[1]
			x := match[2]
			y := match[3]

			switch fullMatch {
			case "do()":
					isEnabled = true
			case "don't()":
					isEnabled = false
			default:
					if isEnabled && mul != "" {
							num1 := aochelpers.ParseInt(x)
							num2 := aochelpers.ParseInt(y)
							sum += num1 * num2
					}
			}
	}

	fmt.Println("Day 3, part 2: ", sum)
}