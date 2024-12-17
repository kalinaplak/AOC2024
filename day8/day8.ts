const fs = require('fs');
import { count, Dictionary, distinct, filter, filtermap, flatmap, groupbytoobject, pipe, toarray } from "powerseq";

type Point = { x: number; y: number };
type FrequencyMap = Dictionary<Point[]>;

function isInsideMap(width: number, height: number, point: Point) {
	return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

function parseInput(input: string): FrequencyMap {
	return pipe(
		input.split('\n'),
		flatmap((r, x) =>
			pipe(
				r.split(''),
				filtermap((el, y) => el !== '.' ? { x, y, value: el } : null),
			)),
		groupbytoobject(el => el.value, el => ({ x: el.x, y: el.y }))

	)
}

function calculateAntinodes(a: Point, b: Point): Point[] {
	const distanceX = b.x - a.x;
	const distanceY = b.y - a.y;
	return [
		{ x: a.x - distanceX, y: a.y - distanceY },
		{ x: b.x + distanceX, y: b.y + distanceY }
	];
}

function calculateAllAntinodes(antennas: Point[], extended?: boolean, width?: number, height?: number): Point[] {
	return pipe(
		antennas,
		flatmap((p1, i) => pipe(
			antennas,
			filter((_, j) => j > i),
			flatmap(p2 => !extended ? calculateAntinodes(p1, p2) : calculateExtendedAntinodes(p1, p2, width, height))
		)),
		toarray()
	);
}

function calculateAntinodesCount(input: string, extended?: boolean) {
	const antennas = parseInput(input);
	const rows = input.split('\n');

	return pipe(
		Object.values(antennas),
		flatmap(entry => !extended
			? calculateAllAntinodes(entry)
			: calculateAllAntinodes(entry, true, rows[0].length, rows.length)
		),
		filter(p => isInsideMap(rows[0].length, rows.length, p)),
		distinct(p => `${p.x},${p.y}`),
		count()
	)
}

//1.
function part1(input: string) {
	return calculateAntinodesCount(input);
}

//2.
function calculateSingleAntinode(a: Point, b: Point, distanceX: number, distanceY: number, dir: 'A' | 'B'): Point {
	return dir === 'A' ? { x: a.x - distanceX, y: a.y - distanceY } : { x: b.x + distanceX, y: b.y + distanceY };
}

function calculateExtendedAntinodes(a: Point, b: Point, width: number, height: number) {
	function calculateExtendedAntinodesInnerIterative(start: Point, next: Point, dir: 'A' | 'B'): Point[] {
		const result: Point[] = [a, b];
		let current = next;
		let isOutsideMap = false;
		const distanceX = b.x - a.x;
		const distanceY = b.y - a.y;
		while (!isOutsideMap) {
			const antinode = dir === 'A'
				? calculateSingleAntinode(start, current, distanceX, distanceY, 'A')
				: calculateSingleAntinode(start, current, distanceX, distanceY, 'B');

			if (!isInsideMap(width, height, antinode)) {
				isOutsideMap = true;
			} else {
				result.push(antinode);
				start = current;
				current = antinode;
			}
		}
		return result;
	}

	return [
		...calculateExtendedAntinodesInnerIterative(a, b, 'A'),
		...calculateExtendedAntinodesInnerIterative(a, b, 'B')
	];
}

function part2(input: string) {
	return calculateAntinodesCount(input, true);
}

const rawInput = fs.readFileSync('./day8/input.txt', 'utf-8');
console.log(part1(rawInput));
console.log(part2(rawInput));
