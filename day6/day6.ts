import { elementat, filter, filtermap, pipe, count } from "powerseq";

const fs = require('fs');

interface MapField {
  visited: boolean;
  visitedDirection: number;
  value: '.' | '#' | '^',
  position: { row: number; column: number; }
}

const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function parseInput(input: string): MapField[][] {
  return input.split('\n').map((l, r) => l.split("").map((el, c) => ({ visited: el === '^' ? true : false, value: el, visitedDirection: 0, position: { row: r, column: c } } as MapField)));
}

function isInsideMap(map: MapField[][], row: number, col: number) {
  return row >= 0 && row < map.length && col >= 0 && col < map[row].length;
}

function canMoveToField(map: MapField[][], row: number, col: number) {
  return map[row][col].value !== '#';
}

function markAsVisited(map: MapField[][], row: number, col: number, dir: number) {
  map[row][col] = { ...map[row][col], visited: true, visitedDirection: dir };
}

function findStartingPoint(fields: MapField[][]): { row: number; column: number; } {
  return pipe(
    fields,
    filtermap(r => r.find(c => c.value === '^')?.position),
    elementat(0)
  );
}

function moveThroughMap(map: MapField[][]): { visited: MapField[], loop: boolean } {
  const startingPoint = findStartingPoint(map);
  let { row, column } = startingPoint;
  let visitedFields = [map[row][column]];
  let outsideMap = false;
  let loopDetected = false;
  let dirIndex = 0;
  while (!outsideMap && !loopDetected) {
    const direction = directions[dirIndex];
    const newRow = row + direction[0];
    const newCol = column + direction[1];
    if (isInsideMap(map, newRow, newCol)) {
      if (canMoveToField(map, newRow, newCol)) {
        if (!map[newRow][newCol].visited) {
          markAsVisited(map, newRow, newCol, dirIndex)
          visitedFields.push(map[newRow][newCol])
        } else if (map[newRow][newCol].visitedDirection === dirIndex) {
          loopDetected = true;
        }
        row = newRow;
        column = newCol;
      } else {
        dirIndex = (dirIndex + 1) % directions.length;
      }
    } else {
      outsideMap = true;
    }
  }
  return { visited: visitedFields, loop: loopDetected };
}

//1.
function part1(map: MapField[][]) {
  const clone = JSON.parse(JSON.stringify(map));
  return moveThroughMap(clone);
}

//2.
function part2(map: MapField[][]) {
  const visited = part1(map);
  return pipe(
    visited.visited,
    filter(f => f.value !== '^'),
    count(f => {
      const clone: MapField[][] = parseInput(fs.readFileSync('./day6/input.txt', 'utf-8'));
      clone[f.position.row][f.position.column].value = '#';
      return moveThroughMap(clone).loop
    })
  )
}

const input = parseInput(fs.readFileSync('./day6/input.txt', 'utf-8'));
console.log(part1(input).visited.length);
const before = new Date().getTime();
console.log(part2(input));
const after = new Date().getTime();
console.log(`Part 2: ${after - before} ms`); //Took 10690 ms
