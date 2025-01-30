package day7

import (
	"aoc2024/aochelpers"
	"fmt"
	"strings"
)

type EquationModel struct {
	TestValue int64
	Numbers   []int64
}

type Operator string

const (
	Add    Operator = "+"
	Multiply Operator = "*"
	Concat   Operator = "||"
)

func parseInput(input string) []EquationModel {
	lines := strings.Split(input, "\n")
	var equations []EquationModel

	for _, line := range lines {
		parts := strings.Split(line, ":")
		testValue := aochelpers.ParseInt64(strings.TrimSpace(parts[0]))
		numStrings := strings.Fields(parts[1])
		var numbers []int64
		for _, numStr := range numStrings {
			num := aochelpers.ParseInt64(numStr)
			numbers = append(numbers, num)
		}
		equations = append(equations, EquationModel{TestValue: testValue, Numbers: numbers})
	}
	return equations
}

func processEquation(numbers []int64, targetValue int64, operators []Operator) bool {
	var processEquationInner func(currentResult int64, index int) bool
	
	processEquationInner = func(currentResult int64, index int) bool {
		if index == len(numbers) {
			return currentResult == targetValue
		}
		nextNumber := numbers[index]
		
		for _, operator := range operators {
			switch operator {
			case Add:
				if processEquationInner(currentResult + nextNumber, index+1) {
					return true
				}
			case Multiply:
				if processEquationInner(currentResult * nextNumber, index+1) {
					return true
				}
			case Concat:
				concatenated := aochelpers.ParseInt64(fmt.Sprintf("%d%d", currentResult, nextNumber))
				if processEquationInner(concatenated, index+1) {
					return true
				}
			}
		}
		return false
	}

	return processEquationInner(numbers[0], 1)
}

func getCalibrationNumber(equations []EquationModel, operators []Operator) int64 {
	sum := int64(0)
	for _, equation := range equations {
		if processEquation(equation.Numbers, equation.TestValue, operators) {
			sum += equation.TestValue
		}
	}
	return sum
}

func Part1(){
	input := parseInput(aochelpers.ReadFileAsString("./day7/input.txt"))
	result := getCalibrationNumber(input, []Operator{Add, Multiply})
	fmt.Println("Day 7, part 1:", result)
}

func Part2(){
	input := parseInput(aochelpers.ReadFileAsString("./day7/input.txt"))
	result := getCalibrationNumber(input, []Operator{Add, Multiply, Concat})
	fmt.Println("Day 7, part 2:", result)
}