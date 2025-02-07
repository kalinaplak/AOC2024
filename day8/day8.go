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

func calculateAllAntinodes(antennas []Point, extended bool, width, height int) []Point {
	var results []Point

	for i, p1 := range antennas {
		for j := i + 1; j < len(antennas); j++ {
			p2 := antennas[j]
			var newAntinodes []Point
			if(extended){
				newAntinodes = calculateExtendedAntinodes(p1, p2, width, height)
			} else {
				newAntinodes = calculateAntinodes(p1, p2)
			}
			results = append(results, newAntinodes...)
		}
	}
	return results
}

func calculateAntinodesCount(input string, extended bool) int {
	antennas := parseInput(input)
	rows := strings.Split(input, "\n")
	width, height := len(rows[0]), len(rows)

	pointSet := make(map[string]bool)

	for _, points := range antennas {
		antinodes := calculateAllAntinodes(points, extended, width, height) 
		for _, p := range antinodes {
			if isInsideMap(width, height, p) {
				key := fmt.Sprintf("%d,%d", p.X, p.Y)
				pointSet[key] = true
			}
		}
	}
	return len(pointSet)
}

func Part1() {
	input := aochelpers.ReadFileAsString("./day8/input.txt")
	result := calculateAntinodesCount(input, false)
	fmt.Println("Day 8, part 1:", result)
}

//2.
func calculateSingleAntinode(a, b Point, distanceX, distanceY int, dir rune) Point {
	if( dir == 'A' ){
		return Point{ X: a.X - distanceX, Y: a.Y - distanceY } 
	 } else {
		return Point{ X: b.X + distanceX, Y: b.Y + distanceY }
	 }
}

func calculateExtendedAntinodes(a,b Point, width, height int) []Point {
	var calculateExtendedAntinodesInnerIterative func(start, next Point, dir rune) []Point
	
	calculateExtendedAntinodesInnerIterative = func(start, next Point, dir rune) []Point {
		result := []Point{a,b}
		current := next
		isOutsideMap := false
		distanceX := b.X - a.X
		distanceY := b.Y - a.Y
		for !isOutsideMap {
			var antinode Point;
			if(dir == 'A'){
				antinode = calculateSingleAntinode(start, current, distanceX, distanceY, 'A')
			} else {
				antinode = calculateSingleAntinode(start, current, distanceX, distanceY, 'B')
			}
			if(!isInsideMap(width, height, antinode)){
				isOutsideMap = true
			} else {
				result = append(result, antinode)
				start = current
				current = antinode
			}
		}
		return result
	}

	part1 := calculateExtendedAntinodesInnerIterative(a, b, 'A')
	part2 := calculateExtendedAntinodesInnerIterative(a, b, 'B')
	return append(part1, part2...)
}

func Part2() {
	input := aochelpers.ReadFileAsString("./day8/input.txt")
	result := calculateAntinodesCount(input, true)
	fmt.Println("Day 8, part 2:", result)
}