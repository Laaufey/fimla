import fourLetterWords from "../data/fourLetterWords.json";
import fiveLetterWords from "../data/fiveLetterWords.json";

// Set-backed copies of the word lists for O(1) lookups. pickLetters()
// below tests several candidate letter sets per round, and each test
// checks every combo of 4 and 5 letters (7^4 + 7^5 = ~19k combos), so a
// linear .includes()/.some() scan over these ~2k/~6k word arrays (the
// old logic's approach) would add up fast across retries.
const FOUR_LETTER_WORD_SET = new Set(fourLetterWords);
const FIVE_LETTER_WORD_SET = new Set(fiveLetterWords);

// A puzzle's letters must yield at least this many findable words
// (each containing the required center letter) before it's used - see
// pickLetters().
const MIN_FINDABLE_WORDS = 3;

export default {
  letters: [],
  fourLetterWords: [],
  fiveLetterWords: [],
  fourLetterHints: [],
  fiveLetterHints: [],
  allFoundWords: [],
  word: "",
  numberOfGuesses: 0,
  vowels: "eyuioa",
  consonants: "qwrtpsdfghjklcvbnm",
  error: "",
  // Bumped by shuffle() and startGame() so the letter tiles can key off it
  // and remount - replaying their pop-in animation - whenever the letters
  // are reordered or a new puzzle starts.
  round: 0,

  getRandomLetters(arr, num) {
    const letters = [...arr].sort(() => 0.5 - Math.random());
    return letters.slice(0, num);
  },

  // Reorders the existing letters only - it must never change which
  // letters are in play, since found words (fourLetterWords,
  // fiveLetterWords, allFoundWords) stay valid only as long as the letter
  // set itself doesn't change. Use startGame() for an actual new puzzle.
  //
  // The first letter is the required center letter shown in the middle
  // of the honeycomb - shuffle only reorders the other six (the ring),
  // so the center never jumps to a different letter underneath the
  // player mid-round.
  shuffle(letters) {
    const [center, ...rest] = letters;
    rest.sort(() => 0.5 - Math.random());
    this.letters = [center, ...rest];
    // Hints are indexed by letter position, so they go stale (pointing at
    // the wrong letter) whenever the letters are reordered.
    this.getHints();
    this.round += 1;
  },

  startGame() {
    // OLD LOGIC - drew letters with no guarantee the required center
    // letter (letters[0]) actually appeared in any findable word, or
    // that the puzzle had enough findable words at all:
    // this.letters = this.randomLetters;
    this.letters = this.pickLetters();
    this.fourLetterWords = [];
    this.fiveLetterWords = [];
    this.allFoundWords = [];
    this.error = "";
    this.getHints();
    this.round += 1;
  },

  submitWord() {
    if (
      this.fourLetterWords.includes(this.word) ||
      this.fiveLetterWords.includes(this.word)
    ) {
      this.error = "Already found";
    } else if (this.allFourLetterWords.includes(this.word)) {
      this.fourLetterWords.push(this.word);
      this.allFoundWords.push(this.word);
    } else if (this.allFiveLetterWords.includes(this.word)) {
      this.fiveLetterWords.push(this.word);
      this.allFoundWords.push(this.word);
    } else {
      this.error = "Invalid word";
    }
  },

  allLetterCombos(letters, length) {
    return Array.from({ length })
      .fill(letters)
      .reduce((a, b) =>
        a.reduce((c, d) => c.concat(b.map((e) => [].concat(d, e))), [])
      )
      .map((a) => a.join(""));
  },

  handleKeydown(e) {
    if (e.key.match(/^[a-z]$/) && !this.letters.includes(e.key)) {
      this.error = "bad letter";
    }
    if (e.key === "Enter") {
      return this.submitWord();
    }
  },
  getHints() {
    this.letters.forEach((letter, index) => {
      this.fourLetterHints[index] = this.allFourLetterWords.filter((f) =>
        f.toLowerCase().startsWith(letter)
      );
      this.fiveLetterHints[index] = this.allFiveLetterWords.filter((f) =>
        f.toLowerCase().startsWith(letter)
      );
    });
  },

  // How many words of the given length can be built from `letters` and
  // contain `center` - used by pickLetters() to test a candidate letter
  // set before committing to it.
  countWordsWithCenter(letters, center) {
    const countFor = (length, wordSet) =>
      this.allLetterCombos(letters, length).filter(
        (combo) => combo.includes(center) && wordSet.has(combo)
      ).length;
    return countFor(4, FOUR_LETTER_WORD_SET) + countFor(5, FIVE_LETTER_WORD_SET);
  },

  // Keeps drawing fresh letter sets (see randomLetters) until one has at
  // least MIN_FINDABLE_WORDS words that all contain the required center
  // letter (letters[0]) - a puzzle should never start out unsolvable, or
  // barely solvable. Capped so a pathological word list still starts a
  // round rather than looping forever.
  pickLetters() {
    let candidate = this.randomLetters;
    let attempts = 0;
    while (
      this.countWordsWithCenter(candidate, candidate[0]) < MIN_FINDABLE_WORDS &&
      attempts < 200
    ) {
      candidate = this.randomLetters;
      attempts += 1;
    }
    return candidate;
  },

  // COMPUTED PROPERTIES

  // OLD LOGIC - a "found" word didn't have to contain the center letter
  // (letters[0]) at all, so it could be made entirely from ring letters:
  // get allFourLetterWords() {
  //   return this.allLetterCombos(this.letters, 4).filter((combo) =>
  //     fourLetterWords.some((word) => combo === word)
  //   );
  // },
  // get allFiveLetterWords() {
  //   return this.allLetterCombos(this.letters, 5).filter((combo) =>
  //     fiveLetterWords.some((word) => combo === word)
  //   );
  // },

  get allFourLetterWords() {
    const [center] = this.letters;
    return this.allLetterCombos(this.letters, 4).filter(
      (combo) => combo.includes(center) && FOUR_LETTER_WORD_SET.has(combo)
    );
  },

  get allFiveLetterWords() {
    const [center] = this.letters;
    return this.allLetterCombos(this.letters, 5).filter(
      (combo) => combo.includes(center) && FIVE_LETTER_WORD_SET.has(combo)
    );
  },

  get allWords() {
    return this.allFourLetterWords.concat(this.allFiveLetterWords);
  },

  get progressPercentage() {
    return (this.allFoundWords.length / this.allWords.length) * 100;
  },

  // Whether every findable word in the current puzzle has been found -
  // drives the "you won" modal.
  get wonAll() {
    return (
      this.allWords.length > 0 &&
      this.allFoundWords.length === this.allWords.length
    );
  },

  get randomLetters() {
    return this.getRandomLetters(this.vowels, 3).concat(
      this.getRandomLetters(this.consonants, 4)
    );
  },
};
