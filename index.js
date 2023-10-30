// A2Z F23
// Daniel Shiffman
// https://github.com/Programming-from-A-to-Z/A2Z-F23

// This is based on Allison Parrish's great RWET examples
// https://github.com/aparrish/rwet-examples

import * as fs from 'fs';
import { MarkovGenerator } from './markov.js';

const raw = fs.readFileSync('itp.txt', 'utf-8');
// An array of lines from a text file
const lines = raw.split('\n');

// The Markov Generator object
// N-gram length and maximum length
const markov = new MarkovGenerator(4, 120);

// Feed one line at a time
for (let i = 0; i < lines.length; i++) {
  markov.feed(lines[i]);
}

// Generate some text
let result = markov.generate();
console.log(result);
