package day6

import (
	"fmt"
	"strings"
	"aoc2024/aochelpers"
)

type MapField struct {
	Visited          bool
	VisitedDirection int
	Value            string
	Position         Position
}

type Position struct {
	Row, Column int
}

type MoveResult struct {
	Visited []MapField
	Loop    bool
}

var directions = [][]int{ {-1, 0}, {0, 1}, {1, 0}, {0, -1} }

func parseInput(input string) [][]MapField {
	lines := strings.Split(input, "\n")
	grid := make([][]MapField, len(lines))

	for r, line := range lines {
		row := make([]MapField, len(line))
		for c, el := range line {
			row[c] = MapField{
				Visited:          el == '^',
				VisitedDirection: 0,
				Value:            string(el),
				Position:         Position{Row: r, Column: c},
			}
		}
		grid[r] = row
	}

	return grid
}

func isInsideMap(grid [][]MapField, row, col int) bool {
	return row >= 0 && row < len(grid) && col >= 0 && col < len(grid[row])
}

func canMoveToField(grid [][]MapField, row, col int) bool {
	if !isInsideMap(grid, row, col) {
		return false
	}
	return grid[row][col].Value != "#"
}

func markAsVisited(grid [][]MapField, row, col, dir int) {
	grid[row][col].Visited = true
	grid[row][col].VisitedDirection = dir
}

func findStartingPoint(fields [][]MapField) Position {
	for r := 0; r < len(fields); r++ {
		for c := 0; c < len(fields[r]); c++ {
			if fields[r][c].Value == "^" {
				return Position{Row: r, Column: c}
			}
		}
	}
	return Position{}
}

func moveThroughMap(grid [][]MapField) MoveResult {
	startingPoint := findStartingPoint(grid)
	row, column := startingPoint.Row, startingPoint.Column
	visitedFields := []MapField{grid[row][column]}
	outsideMap := false
	loopDetected := false
	dirIndex := 0

	for !outsideMap && !loopDetected {
		direction := directions[dirIndex]
		newRow, newCol := row+direction[0], column+direction[1]

		if isInsideMap(grid, newRow, newCol) {
			if canMoveToField(grid, newRow, newCol) {
				if !grid[newRow][newCol].Visited {
					markAsVisited(grid, newRow, newCol, dirIndex)
					visitedFields = append(visitedFields, grid[newRow][newCol])
				} else if grid[newRow][newCol].VisitedDirection == dirIndex {
					loopDetected = true
				}
				row, column = newRow, newCol
			} else {
				dirIndex = (dirIndex + 1) % len(directions) // Change direction
			}
		} else {
			outsideMap = true
		}
	}

	return MoveResult{Visited: visitedFields, Loop: loopDetected}
}

func Part1() {
	input := parseInput(aochelpers.ReadFileAsString("./day6/input.txt"))
	result := moveThroughMap(input)
	fmt.Println("Day 6, part 1:", len(result.Visited))
}

func Part2() {
	input := parseInput(aochelpers.ReadFileAsString("./day6/input.txt"))
	result := moveThroughMap(input)
	loopCount := 0
	for _, f := range result.Visited {
		if f.Value != "^" {
			clone := parseInput(aochelpers.ReadFileAsString("./day6/input.txt"))
			clone[f.Position.Row][f.Position.Column].Value = "#"
			result := moveThroughMap(clone)
			if result.Loop {
				loopCount++
			}
		}
	}

	fmt.Println("Day 6, part 2:", loopCount)
}
