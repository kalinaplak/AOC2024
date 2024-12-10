const fs = require('fs');
import { Dictionary, every, filtermap, groupbytoobject, map, pipe, sum } from "powerseq";

interface MappedInput {
  rules: Dictionary<number[]>;
  numbers: number[][];
}

interface NumberWithCorrectness {
  n: number;
  correct: boolean;
}

type PageNumber = NumberWithCorrectness | number;

function parseInput(input: string): MappedInput {
  const [rules, numbers] = input.split('\n\n');
  return {
    rules: pipe(
      rules.split('\n'),
      map(r => r.split('|')),
      groupbytoobject(r => parseInt(r[0]), r => parseInt(r[1]))
    ),
    numbers: numbers.split('\n').map(r => r.split(',').map(Number))
  }
}

function getNumValue(num: PageNumber) {
  return typeof num === "number" ? num : num.n;
}

function isRuleFulfilled(row: PageNumber[], index: number, rule: number[]) {
  return pipe(
    row.slice(0, index),
    every(n => !rule.includes(getNumValue(n)))
  )
}

function isCorrectPage(page: PageNumber[], rules: Dictionary<number[]>) {
  if (!page) return;
  return page.every((num, i) => {
    const rule = rules[getNumValue(num)];
    return !rule || isRuleFulfilled(page, i, rule);
  });
}

//1.
function part1(input: MappedInput) {
  return pipe(
    input.numbers,
    filtermap(page => isCorrectPage(page, input.rules) ? page : null),
    sum(p => p[Math.round((p.length - 1) / 2)])
  )
}

//2.
function checkCorrectness(page: PageNumber[], rules: Dictionary<number[]>): NumberWithCorrectness[] {
  return page.map((num, i) => {
    const nVal = getNumValue(num);
    const rule = rules[nVal];
    return { n: nVal, correct: !rule || isRuleFulfilled(page, i, rule) };
  });
}

function swapWithPrevious(arr: PageNumber[], index: number) {
  if (index > 0) [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
  return arr;
}

function makePageCorrect(page: NumberWithCorrectness[], rules: Dictionary<number[]>) {
  const firstIncorrect = page.findIndex(el => !el.correct);
  const correctedPage = checkCorrectness(swapWithPrevious(page, firstIncorrect), rules);
  return isCorrectPage(correctedPage, rules) ? correctedPage : makePageCorrect(correctedPage, rules);
}

function part2(input: MappedInput) {
  return pipe(
    input.numbers,
    filtermap(page => {
      const mapped = checkCorrectness(page, input.rules);
      return mapped.some(n => !n.correct) ? mapped : null
    }),
    map((page) => makePageCorrect(page, input.rules)),
    sum(p => p[Math.round((p.length - 1) / 2)].n)
  )
}

const input = parseInput(fs.readFileSync('./day5/input.txt', 'utf-8'));

console.log(part1(input));
console.log(part2(input));