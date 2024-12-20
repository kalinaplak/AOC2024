import { filtermap, flatmap, pipe, toarray, map, distinct, count, sum } from "powerseq";

const fs = require('fs');
const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function parseInput(input: string) {
  return input.split('\n').map(line => line.split('').map(Number));
}

function isInBounds(grid: number[][], x: number, y: number) {
  return x >= 0 && y >= 0 && x < grid.length && y < grid[0].length;
}

function findPaths(grid: number[][], x: number, y: number, currStep: number, path: string[]): string[][] {
  if (currStep === 9) {
    return [[...path, `${x},${y}`]];
  }

  return pipe(
    directions,
    flatmap(([dx, dy]) => {
      const newRow = x + dx;
      const newCol = y + dy;
      if (isInBounds(grid, newRow, newCol) && grid[newRow][newCol] === currStep + 1) {
        return findPaths(grid, newRow, newCol, currStep + 1, [...path, `${x},${y}`]);
      }
      return [];
    }),
    toarray()
  )
}

function getStartingPoints(grid: number[][]) {
  return pipe(
    grid,
    flatmap((row, i) => filtermap(row, (col, j) => col === 0 ? [i, j] : null)),
    toarray()
  )
}

function calculateRatings(grid: number[][], wholeTrailMode = false) {
  return pipe(
    getStartingPoints(grid),
    sum(([x, y]) => pipe(
      findPaths(grid, x, y, 0, []),
      map(p => !wholeTrailMode ? p.at(-1) : p.join('-')),
      distinct(),
      count()
    )),
  );
}

function part1(grid: number[][]) {
  return calculateRatings(grid);
}

function part2(grid: number[][]) {
  return calculateRatings(grid, true)
}

const input = parseInput(fs.readFileSync('./day10/input.txt', 'utf-8'));
// console.log(input);
console.log(part1(input));
console.log(part2(input));
