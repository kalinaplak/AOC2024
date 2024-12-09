const fs = require('fs');
import { count, map, pairwise, pipe, toarray } from 'powerseq';

function parseInput(input: string) {
  return pipe(
    input.split(/\n/),
    map(l => l.split(' ').map(Number)),
    toarray()
  );
}

function mapToSafe(input: number[][]) {
  return pipe(
    input,
    map(line =>
      pipe(
        pairwise(line),
        map(([n1, n2]) => n1 - n2),
        toarray()
      )
    ),
    map(line =>
      (line.every(n => n > 0) || line.every(n => n < 0)) &&
      line.every(n => Math.abs(n) > 0 && Math.abs(n) < 4)
    ),
    toarray()
  )
}

//1.
function part1(input: number[][]) {
  return count(mapToSafe(input), l => !!l);
}

//2.
function removeElementAtIndex(arr: number[], index: number): number[] {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function part2(input: number[][]) {
  const mappedInput = mapToSafe(input);
  return pipe(
    input,
    count((r, i) => mappedInput[i] ? true : r.some((_, j) => {
      const withoutCol = removeElementAtIndex(r, j);
      return mapToSafe([withoutCol])[0];
    })),
  )
}

const input = parseInput(fs.readFileSync('./day2/input.txt', 'utf-8'));
console.log(input);
console.log(part1(input));
console.log(part2(input));
