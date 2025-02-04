const fs = require('fs');
import { groupbytoobject, map, orderby, pipe, reduce, sum, zip } from 'powerseq';

function parseInput(input: string) {
  return pipe(
    input.split(/\n/),
    map(line => line.trim().split(/\s+/).map(Number)),
    reduce(
      ([accLeft, accRight], [currleft, currRight]) => [accLeft.concat(currleft), accRight.concat(currRight)],
      [[], []] as number[][]
    ),
  );
}

//1.
function part1([left, right]: number[][]) {
  return pipe(
    zip(
      orderby(left, num => num),
      orderby(right, num => num),
      (l, r) => [l, r]
    ),
    sum(([l, r]) => Math.abs(l - r)),
  )
}

//2.
function part2([left, right]: number[][]) {
  const map = groupbytoobject(right, n => n, v => v);
  return sum(left, l => (map[l]?.length || 0) * l);
}

const input = parseInput(fs.readFileSync('./day1/input.txt', 'utf-8'));
console.log(input);
console.log(part1(input));
console.log(part2(input));






