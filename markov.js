// A2Z F23
// Daniel Shiffman
// https://github.com/Programming-from-A-to-Z/A2Z-F23

// This is based on Allison Parrish's great RWET examples
// https://github.com/aparrish/rwet-examples

export function random(val) {
  if (Array.isArray(val)) {
    const r = Math.random() * val.length;
    return val[Math.floor(r)];
  } else if (typeof val === 'number') {
    return Math.random() * val;
  }
}

// A weighted random selection function
export function weightedSelection(choices, temperature = 1.0) {
  let index = 0;
  let keys = Object.keys(choices);
  // Adjust probabilities based on temperature
  let adjustedChoices = {};
  let sum = 0;
  for (let key of keys) {
    // Raise each probability to the power of (1 / temperature)
    // A higher temperature (> 1) will make the probabilities more uniform (more random)
    // A lower temperature (< 1) will amplify the differences, making the selection more deterministic
    adjustedChoices[key] = Math.pow(choices[key], 1 / temperature);
    sum += adjustedChoices[key];
  }
  // Normalize the adjusted probabilities
  for (let key of keys) {
    // Normalize the adjusted probabilities so they sum to 1
    adjustedChoices[key] /= sum;
  }
  let start = random(1);
  while (start > 0) {
    // Get the next possible choice and subtract its probability from 'start'
    let nextChoice = keys[index];
    let probability = adjustedChoices[nextChoice];
    start -= probability;
    index++;
  }
  index--;
  return keys[index];
}

// A Markov Generator class
export class MarkovGenerator {
  constructor(n, max) {
    // Order (or length) of each ngram
    this.n = n;
    // What is the maximum amount we will generate?
    this.max = max;
    // An object as dictionary
    // each ngram is the key, a dictionary of possible next elements and their counts
    this.ngrams = {};
    // A separate array of possible beginnings to generated text
    this.beginnings = [];
  }

  // A function to feed in text to the markov chain
  feed(text) {
    // Discard this line if it's too short
    if (text.length < this.n) {
      return false;
    }

    // Store the first ngram of this line
    let beginning = text.substring(0, this.n);
    this.beginnings.push(beginning);

    // Now let's go through everything and create the dictionary
    for (let i = 0; i < text.length - this.n; i++) {
      let gram = text.substring(i, i + this.n);
      let next = text.charAt(i + this.n);
      // Is this a new one?
      if (!this.ngrams.hasOwnProperty(gram)) {
        this.ngrams[gram] = {};
      }
      // Increment the count for this next character
      if (!this.ngrams[gram].hasOwnProperty(next)) {
        this.ngrams[gram][next] = 0;
      }
      this.ngrams[gram][next]++;
    }

    // Normalize the counts to probabilities
    for (let gram in this.ngrams) {
      let total = 0;
      for (let next in this.ngrams[gram]) {
        total += this.ngrams[gram][next];
      }
      for (let next in this.ngrams[gram]) {
        this.ngrams[gram][next] /= total;
      }
    }
  }

  // Generate a text from the information ngrams
  generate(temperature) {
    // Get a random beginning
    let current = random(this.beginnings);

    let output = current;

    // Generate a new token max number of times
    for (let i = 0; i < this.max; i++) {
      // If this is a valid ngram
      if (this.ngrams.hasOwnProperty(current)) {
        // What are all the possible next tokens and their probabilities
        let possible_next = this.ngrams[current];
        // Pick one using weighted random selection
        let next = weightedSelection(possible_next, temperature);
        // Add to the output
        output += next;
        // Get the last N entries of the output; we'll use this to look up
        // an ngram in the next iteration of the loop
        current = output.substring(output.length - this.n, output.length);
      } else {
        break;
      }
    }
    // Here's what we got!
    return output;
  }
}
