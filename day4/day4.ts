const fs = require('fs');
import { flatmap, map, pipe, sum, toarray } from 'powerseq';

function parseInput(input: string) {
  return pipe(
    input.split(/\n/),
    map(line => line.split("")),
    toarray()
  );
}

function inBounds(grid: string[][], row: number, col: number) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function checkWordInDirection(word, grid: string[][], row: number, col: number, dir: number[]): boolean {
  return Array.from({ length: word.length }, (_, i) => {
    const newRow = row + i * dir[0];
    const newCol = col + i * dir[1];
    return inBounds(grid, newRow, newCol) && grid[newRow][newCol] === word[i];
  }).every(Boolean);
}

//1.
function part1(grid: string[][]): number {
  const word = "XMAS";
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  return pipe(
    directions,
    flatmap(([dr, dc]) => pipe(
      grid,
      flatmap((row, r) =>
        row.map((_, c) => checkWordInDirection(word, grid, r, c, [dr, dc]) ? 1 : 0)
      )
    )),
    sum()
  )
}

//2.
function checkXShape(grid: string[][], row: number, col: number) {
  return grid[row][col] === 'A' &&
    (checkWordInDirection('AM', grid, row, col, [-1, -1]) && checkWordInDirection('AS', grid, row, col, [1, 1]) && (
      (checkWordInDirection('AM', grid, row, col, [-1, 1]) && checkWordInDirection('AS', grid, row, col, [1, -1])) ||
      (checkWordInDirection('AM', grid, row, col, [1, -1]) && checkWordInDirection('AS', grid, row, col, [-1, 1]))
    )) ||
    (checkWordInDirection('AM', grid, row, col, [1, 1]) && checkWordInDirection('AS', grid, row, col, [-1, -1]) && (
      (checkWordInDirection('AM', grid, row, col, [1, -1]) && checkWordInDirection('AS', grid, row, col, [-1, 1])) ||
      (checkWordInDirection('AM', grid, row, col, [-1, 1]) && checkWordInDirection('AS', grid, row, col, [1, -1]))
    ))
}

function part2(grid: string[][]): number {
  return pipe(
    grid,
    flatmap((row, r) =>
      row.map((_, c) => checkXShape(grid, r, c) ? 1 : 0)
    ),
    sum()
  )
}

const grid = parseInput(fs.readFileSync('./day4/input.txt', 'utf-8'))

console.log(part1(grid));
console.log(part2(grid));