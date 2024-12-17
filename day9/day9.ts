import { filter, pipe, repeatvalue, sum } from "powerseq";

const fs = require('fs');

type DiskMap = (string | number)[];

function parseInput(input: string): DiskMap {
  return input.split('').map(Number).map((n, i) => [...repeatvalue(i % 2 !== 0 ? '.' : (i / 2), n)]).flat();
}

function swap(array: any[], i: number, j: number) {
  [array[i], array[j]] = [array[j], array[i]];
}

function compactDisk(disk: DiskMap) {
  let i = 0;
  let j = disk.length - 1;
  while (i < j) {
    while (i < j && disk[i] !== '.') i++;
    while (i < j && disk[j] === '.') j--;
    if (i < j) {
      swap(disk, i, j);
      i++;
      j--;
    }
  }
  return disk;
}

function calculateChecksum(diskMap: DiskMap) {
  return pipe(
    diskMap,
    filter(el => el !== "."),
    sum((c, i) => i * Number(c)),
  )
}

function part1(input: string) {
  const compacted = compactDisk(parseInput(input))
  return calculateChecksum(compacted);
}

const input = fs.readFileSync('./day9/input.txt', 'utf-8');
console.log(part1(input)); //6366665108136


