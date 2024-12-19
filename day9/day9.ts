const fs = require('fs');
import { pipe, repeatvalue, sum } from "powerseq";

type DiskMap = (string | number)[];

function parseInput(input: string, flatten = true): DiskMap | DiskMap[] {
  const parsed = input.split('').map(Number).map((n, i) => [...repeatvalue(i % 2 !== 0 ? '.' : (i / 2), n)])
  return flatten ? parsed.flat() : parsed.filter(arr => !!arr.length)
}

function swapElements(array: any[], i: number, j: number) {
  [array[i], array[j]] = [array[j], array[i]];
}

function compactDisk(disk: DiskMap) {
  let i = 0;
  let j = disk.length - 1;
  while (i < j) {
    while (i < j && disk[i] !== '.') i++;
    while (i < j && disk[j] === '.') j--;
    if (i < j) {
      swapElements(disk, i, j);
      i++;
      j--;
    }
  }
  return disk;
}

/*2*/
function splitArray(array: any[], index: number): [any[], any[]] {
  return [array.slice(0, index), array.slice(index)];
}

function insertAfterIndex(array: any[], index: number, item: any): any[] {
  const [firstPart, secondPart] = splitArray(array, index + 1);
  return [...firstPart, item, ...secondPart];
}

function swapArrays(array: any[], array2: any[]) {
  if (array2.length > array.length) return;
  const a = [...array];
  const a2 = [...array2];
  for (let i = 0; i < a2.length; i++) {
    const copy = a[i];
    a[i] = a2[i];
    a2[i] = copy;
  }
  return [a2.length < a.length ? splitArray(a, a2.length) : [a, []], a2]
}

function compactDisk2(disk: DiskMap[]) {
  let i = 0;
  let j = disk.length;
  for (j; j--; j > 0) {
    i = 0;
    if (disk[j][0] === '.') continue;
    for (i; i < j; i++) {
      if (disk[i][0] === '.' && disk[j][0] !== '.' && disk[i].length >= disk[j].length) {
        const [[diskISwapped, additional], diskJSwapped] = swapArrays(disk[i], disk[j]);
        disk[i] = diskISwapped;
        disk[j] = diskJSwapped;
        if (additional.length) {
          disk = insertAfterIndex(disk, i, additional);
          j++;
        }
      }
    }
  }
  return disk.flat();
}

function calculateChecksum(input, flatten = true) {
  const diskMap = flatten ? parseInput(input) : parseInput(input, false);
  const compacted = flatten ? compactDisk(diskMap as DiskMap) : compactDisk2(diskMap as DiskMap[]);
  return pipe(
    compacted,
    sum((c, i) => c !== "." ? i * Number(c) : 0),
  )
}

const input = fs.readFileSync('./day9/input.txt', 'utf-8');
console.log(calculateChecksum(input)); //6366665108136
console.log(calculateChecksum(input, false)); //6398065450842
