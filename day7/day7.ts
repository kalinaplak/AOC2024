import { filter, pipe, sum } from "powerseq";

const fs = require('fs');

interface EquationModel {
  testValue: number;
  numbers: number[]
}

type Operator = '+' | '*' | '||';

function parseInput(input: string) {
  return input.split('\n').map(l => {
    const [test, nums] = l.split(':');
    return {
      testValue: parseInt(test),
      numbers: nums.trim().split(' ').map(Number)
    }
  });
}

function processEquation(numbers: number[], targetValue: number, operators: Operator[]): boolean {
  function processEquationInner(currentResult: number, index: number): boolean {
    if (index === numbers.length) {
      return currentResult === targetValue;
    }

    const nextNumber = numbers[index];

    return operators.some(operator => {
      switch (operator) {
        case '+':
          return processEquationInner(currentResult + nextNumber, index + 1);
        case '*':
          return processEquationInner(currentResult * nextNumber, index + 1);
        case '||':
          return processEquationInner(parseInt(`${currentResult}${nextNumber}`), index + 1);
        default:
          return false;
      }
    });
  }

  return processEquationInner(numbers[0], 1);
}

function getCalibrationNumber(equations: EquationModel[], operators: Operator[]): number {
  return pipe(
    equations,
    filter(({ testValue, numbers }) => processEquation(numbers, testValue, operators)),
    sum(r => r.testValue)
  )
}

const input = parseInput(fs.readFileSync('./day7/input.txt', 'utf-8'));
//1.
console.log(getCalibrationNumber(input, ['+', '*']));
//2.
console.log(getCalibrationNumber(input, ['+', '*', '||']));
