// A2Z F24
// Daniel Shiffman
// https://github.com/Programming-from-A-to-Z/A2Z-F24

// This script is based on Allison Parrish's RWET examples
// https://github.com/aparrish/rwet-examples

import * as fs from 'fs';
import { MarkovGenerator } from './markov.js';

// Initialize a Markov Generator object
const markov = new MarkovGenerator(3, 120);
console.log('Initialized Markov Generator');

// Check if a Markov model exists as 'markov.json'
if (fs.existsSync('markov.json')) {
  console.log('markov.json exists');

  // Read the Markov model from 'markov.json'
  const data = fs.readFileSync('markov.json', 'utf-8');
  const json = JSON.parse(data);

  // Load the saved N-grams and beginnings into the Markov generator
  markov.ngrams = json.ngrams;
  markov.beginnings = json.beginnings;
  console.log('Loaded ngrams and beginnings into Markov generator');
} else {
  console.log('markov.json does not exist, reading raw text from itp.txt');

  // If no model exists, read raw text from 'itp.txt'
  const raw = fs.readFileSync('itp.txt', 'utf-8');

  // Split the raw text into an array of lines
  const lines = raw.split('\n');

  // Feed each line into the Markov generator
  for (let i = 0; i < lines.length; i++) {
    let txt = lines[i];
    markov.feed(txt);
    // Display the progress percentage in the console
    process.stdout.write('\r' + ((100 * i) / lines.length).toFixed(2) + '%');
  }
  // Save the generated Markov model as 'markov.json' for future use
  fs.writeFileSync('markov.json', JSON.stringify(markov, null, 2));
  console.log('Saved Markov model to markov.json');
}

// Set the temperature parameter for text generation (controls randomness)
let temp = 1.0;
console.log('\nSet temperature for text generation:', temp);

// Generate text using the Markov generator with the specified temperature
let result = markov.generate(temp);
console.log('Generated text:', result);
