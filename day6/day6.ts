import { elementat, filtermap, pipe } from "powerseq";

const fs = require('fs');

interface MapField {
  visited: boolean;
  value: '.' | '#' | '^',
}

const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

function parseInput(input: string): MapField[][] {
  return input.split('\n').map(l => l.split("").map(el => ({ visited: el === '^' ? true : false, value: el } as MapField)));
}

function isInsideMap(map: MapField[][], row: number, col: number) {
  return row >= 0 && row < map.length && col >= 0 && col < map[row].length;
}

function canMoveToField(map: MapField[][], row: number, col: number,) {
  return map[row][col].value !== '#';
}

function findStartingPoint(fields: MapField[][]): { row: number; col: number; } {
  return pipe(
    fields,
    filtermap((r, i) => {
      const j = r.findIndex(c => c.value === '^');
      return j !== -1 ? { row: i, col: j } : null
    }),
    elementat(0)
  );
}

function moveThroughMap(map: MapField[][], row: number, col: number): number {
  let visitedCount = 1;
  let outsideMap = false;
  let dirIndex = 0;
  while (!outsideMap) {
    const direction = directions[dirIndex];
    const newRow = row + direction[0];
    const newCol = col + direction[1];
    if (isInsideMap(map, newRow, newCol)) {
      if (canMoveToField(map, newRow, newCol)) {
        if (!map[newRow][newCol].visited) {
          visitedCount++;
        }
        map[newRow][newCol].visited = true;
        row = newRow;
        col = newCol;
      } else {
        dirIndex = (dirIndex + 1) % directions.length;
      }
    } else {
      outsideMap = true;
    }
  }
  return visitedCount;
}

function part1(map: MapField[][]) {
  const startingPoint = findStartingPoint(map);
  return moveThroughMap(map, startingPoint.row, startingPoint.col);
}

const input = parseInput(fs.readFileSync('./day6/input.txt', 'utf-8'));
console.log(part1(input));
