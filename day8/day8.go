package day8

import (
	"aoc2024/aochelpers"
	"fmt"
	"strings"
)

type Point struct {
	X, Y int
}

type FrequencyMap map[rune][]Point

func isInsideMap(width, height int, point Point) bool {
	return point.X >= 0 && point.X < width && point.Y >= 0 && point.Y < height
}

func parseInput(input string) FrequencyMap {
	freqMap := make(FrequencyMap)
	lines := strings.Split(input, "\n")

	for x, line := range lines {
		for y, ch := range line {
			if ch != '.' {
				freqMap[ch] = append(freqMap[ch], Point{x, y})
			}
		}
	}
	return freqMap
}

func calculateAntinodes(a, b Point) []Point {
	distanceX := b.X - a.X
	distanceY := b.Y - a.Y
	return []Point{
		{X: a.X - distanceX, Y: a.Y - distanceY},
		{X: b.X + distanceX, Y: b.Y + distanceY},
	}
}

func calculateAllAntinodes(antennas []Point) []Point {
	var results []Point

	for i, p1 := range antennas {
		for j := i + 1; j < len(antennas); j++ {
			p2 := antennas[j]
			results = append(results, calculateAntinodes(p1, p2)...)
		}
	}
	return results
}

func calculateAntinodesCount(input string) int {
	antennas := parseInput(input)
	rows := strings.Split(input, "\n")
	width, height := len(rows[0]), len(rows)

	pointSet := make(map[string]struct{})

	for _, points := range antennas {
		for _, p := range calculateAllAntinodes(points) {
			if isInsideMap(width, height, p) {
				key := fmt.Sprintf("%d,%d", p.X, p.Y)
				pointSet[key] = struct{}{}
			}
		}
	}
	return len(pointSet)
}

func Part1() {
	input := aochelpers.ReadFileAsString("./day8/input.txt")
	result := calculateAntinodesCount(input)
	fmt.Println("Day 8, part 1:", result)
}


