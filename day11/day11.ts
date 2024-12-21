import { count, flatmap, groupby, map, pipe, reduce, repeatvalue, sum, toarray, tomap, toobject } from "powerseq";

const fs = require('fs');

function parseInput(input: string) {
  return input.split(' ').map(Number);
}

const cache = {};

function splitStone(stone: string) {
  const mid = stone.length / 2;
  return [parseInt(stone.slice(0, mid)), parseInt(stone.slice(mid))];
}

function evolveStone(stone: number): number[] {
  if (cache[stone]) return cache[stone];
  const stoneStr = stone.toString();
  const result: number[] = stone === 0
    ? [1]
    : stoneStr.length % 2 === 0
      ? splitStone(stoneStr)
      : [stone * 2024];

  cache[stone] = result;
  return result;
}

//1.
function evolveStones(initialStones: number[], blinks: number) {
  return pipe(
    repeatvalue(blinks, blinks),
    reduce((acc: number[], _) => {
      acc = pipe(
        acc,
        groupby(s => s),
        map(([key, values]) => [key, values.length]),
        flatmap(([stone, count]) => {
          const evolved = evolveStone(stone);
          return evolved.flatMap(newStone => Array.from(repeatvalue(newStone, count)))
        }),
        toarray()
      );
      return acc;
    }, initialStones),
    count()
  )
}

//2.
function groupStonesIntoMap(stones: number[]) {
  return pipe(
    stones,
    groupby(s => s),
    tomap(([k, _]) => k, ([_, v]) => v.length)
  )
}

function evolveStonesOptimized(initialStones: number[], blinks: number) {
  let stoneCounts = groupStonesIntoMap(initialStones);

  for (let i = 0; i < blinks; i++) {
    const nextCounts = new Map<number, number>();
    for (const [stone, count] of stoneCounts) {
      const evolved = evolveStone(stone);
      for (const newStone of evolved) {
        nextCounts.set(newStone, (nextCounts.get(newStone) || 0) + count);
      }
    }
    stoneCounts = nextCounts;
  }

  return sum(stoneCounts, ([k, v]) => v);
}

const input = parseInput(fs.readFileSync('./day11/input.txt', 'utf-8'));
console.log(evolveStones(input, 25));
console.log(evolveStonesOptimized(input, 75));