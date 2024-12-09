const fs = require('fs');
import { pipe, sum } from "powerseq";

function part1(input: string): number {
  const validMulRegex = /mul\((\d+),(\d+)\)/g;
  return pipe(
    Array.from(input.matchAll(validMulRegex)),
    sum(match => parseInt(match[1]) * parseInt(match[2]))
  );
}


function part2(input: string): number {
  let isEnabled = true;
  return pipe(
    input.matchAll(/(mul\((\d+),(\d+)\)|do\(\)|don't\(\))/g),
    sum(match => {
      const [fullMatch, mul, x, y] = match;
      switch (fullMatch) {
        case 'do()': isEnabled = true; return 0;
        case "don't()": isEnabled = false; return 0;
        default: return (isEnabled && mul) ? parseInt(x) * parseInt(y) : 0
      }
    })
  )
}

const input = fs.readFileSync('./day3/input.txt', 'utf-8');
console.log(part1(input));
console.log(part2(input));