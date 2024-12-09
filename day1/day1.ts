const fs = require('fs');
import { pipe, map, reduce, orderby, toarray, zip, sum } from 'powerseq';

function parseInput(input: string) {
  return pipe(
    input.split(/\n/),
    map(line => line.trim().split(/\s+/).map(Number)),
    reduce(
      ([a1, a2], [num1, num2]) => [a1.concat(num1), a2.concat(num2)],
      [[], []]
    ),
  );
}

//1.
function part1(input: number[][]) {
  return pipe(
    input,
    ([array1, array2]) =>
      zip(
        pipe(array1, orderby(num => num), toarray()),
        pipe(array2, orderby(num => num), toarray()),
        (n1, n2) => [n1, n2]
      ),
    sum(([n1, n2]) => Math.abs(n1 - n2)),
  )
}

//2.
function part2([a1, a2]: number[][]) {
  return sum(a1, n1 => a2.filter(n2 => n2 === n1).length * n1);
}

const input = parseInput(fs.readFileSync('./day1/input.txt', 'utf-8'));
console.log(input);
console.log(part1(input));
console.log(part2(input));






