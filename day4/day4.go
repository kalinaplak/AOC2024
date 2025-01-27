package day4

import (
	"aoc2024/aochelpers"
	"strings"
)

func parseInput(input string) [][]string {
	lines := strings.Split(input, "\n")
	result := make([][]string, len(lines))
	for i, line := range lines {
			result[i] = strings.Split(line, "")
	}
	return result
}

func inBounds(grid [][]string, i , j int) bool {
	return i >= 0 && j >= 0 && i < len(grid) && j < len(grid[0])
}

func checkWordInDirection(word string, grid [][]string, row, col int, direction []int) bool {
	for i := 0; i < len(word); i++ {
		newRow := row + i * direction[0]
		newCol := col + i * direction[1]
		if !inBounds(grid, newRow, newCol) || grid[newRow][newCol] != string(word[i]) {
			return false
		}
	}
	return true
}

func Part1() {
	input := parseInput(aochelpers.ReadFileAsString("./day4/input.txt"))
	word := "XMAS"
	directions := [][]int{{1, 0}, {0, 1}, {1, 1}, {-1, -1}, {-1, 1}, {1, -1}, {0, -1}, {-1, 0}}
	result :=0
	for i := 0; i < len(input); i++ {
		for j := 0; j < len(input[0]); j++ {
			for _, direction := range directions {
				if checkWordInDirection(word, input, i, j, direction) {
					result++
				}
			}
		}
	}
	println("Day 4, part 1: ", result)
}

func checkXShape(grid [][]string, row, col int) bool {
	return grid[row][col] == "A" &&
		(checkWordInDirection("AM", grid, row, col, []int{-1, -1}) && checkWordInDirection("AS", grid, row, col, []int{1, 1}) && (
			(checkWordInDirection("AM", grid, row, col, []int{-1, 1}) && checkWordInDirection("AS", grid, row, col, []int{1, -1})) ||
			(checkWordInDirection("AM", grid, row, col, []int{1, -1}) && checkWordInDirection("AS", grid, row, col, []int{-1, 1})))) ||
		(checkWordInDirection("AM", grid, row, col, []int{1, 1}) && checkWordInDirection("AS", grid, row, col, []int{-1, -1}) && (
			(checkWordInDirection("AM", grid, row, col, []int{1, -1}) && checkWordInDirection("AS", grid, row, col, []int{-1, 1})) ||
			(checkWordInDirection("AM", grid, row, col, []int{-1, 1}) && checkWordInDirection("AS", grid, row, col, []int{1, -1}))))
}

func Part2() {	
	input := parseInput(aochelpers.ReadFileAsString("./day4/input.txt"))
	result := 0
	for i := 0; i < len(input); i++ {
		for j:= 0; j < len(input[0]); j++ {
			if checkXShape(input, i, j) {
				result++
			}
		}
	}
	println("Day 4, part 2: ", result)
}


