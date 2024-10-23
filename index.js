// A2Z F24
// Daniel Shiffman
// https://github.com/Programming-from-A-to-Z/A2Z-F24

// This is based on Allison Parrish's great RWET examples
// https://github.com/aparrish/rwet-examples

import * as fs from 'fs';
import { MarkovGenerator } from './markov.js';

// const raw = fs.readFileSync('frankenstein.txt', 'utf-8');
// // An array of lines from a text file
// const lines = raw.split('\n\n');
// console.log('lines:', lines.length);

// // The Markov Generator object
// // N-gram length and maximum length
// const markov = new MarkovGenerator(3, 100);

// // Feed one line at a time
// for (let i = 0; i < lines.length; i++) {
//   let txt = lines[i].replace(/\n+/g, ' ');
//   markov.feed(txt);
//   process.stdout.write('\r' + ((100 * i) / lines.length).toFixed(2) + '%');
// }

const raw = fs.readFileSync('itp.txt', 'utf-8');
// An array of lines from a text file
const lines = raw.split('\n');
console.log('lines:', lines.length);

// The Markov Generator object
// N-gram length and maximum length
const markov = new MarkovGenerator(3, 120);

// Feed one line at a time
for (let i = 0; i < lines.length; i++) {
  let txt = lines[i];
  markov.feed(txt);
  process.stdout.write('\r' + ((100 * i) / lines.length).toFixed(2) + '%');
}

// write the markov model to a JSON file
fs.writeFileSync('markov.json', JSON.stringify(markov, null, 2));

console.log('\n\n');
// Generate some text
for (let i = 0; i < 10; i++) {
  let temp = 0.01 + (4 * i) / 10;
  let result = markov.generate(temp);
  console.log('temperature:', temp);
  console.log(result);
  console.log('-------');
}
