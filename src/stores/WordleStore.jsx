import words from "../data/fiveLetterWords.json";
export default {
  error: "",
  word: "",
  guesses: [],
  numberOfGuesses: 0,
  totalScore: 0,
  scorePercentage: 0,
  apiword: "",

  get won() {
    return this.guesses[this.numberOfGuesses - 1] === this.word;
  },
  get lost() {
    return this.numberOfGuesses === 6 && this.guesses[this.numberOfGuesses - 1] !== this.word;
  },
  get roundComplete() {
    return (
      this.guesses[this.numberOfGuesses - 1] === this.word ||
      this.numberOfGuesses === 6
    );
  },
  get currentGuess() {
    return this.guesses[this.numberOfGuesses];
  },

  // compare this.word and allGuessedLetters and get all matches - to calculate score based on how many green letters you got in the grid
  get correctLetters() {
    return this.allGuessedLetters.filter((letter1) =>
      this.word.split("").some((letter2) => letter1 === letter2)
    );
  },

  // Array with all the letters that have been guessed
  get allGuessedLetters() {
    return this.guesses.slice(0, this.numberOfGuesses).join("").split("");
  },

  // Array of the green letters - correct letters guessed in the right position
  get greenLetters() {
    return this.word.split("").filter((letter, i) => {
      return this.guesses
        .slice(0, this.numberOfGuesses)
        .map((word) => word[i])
        .includes(letter);
    });
  },

  // Array of correct letters in wrong or right position
  get yellowLetters() {
    return this.word
      .split("")
      .filter((letter) => this.allGuessedLetters.includes(letter));
  },

  // Whether the current row is a complete-length guess and the round
  // hasn't already ended - used to enable/disable the on-screen Enter
  // key. Actual word-list validity is still only known on submit.
  get canSubmit() {
    return (
      !this.roundComplete &&
      (this.currentGuess || "").length === this.word.length
    );
  },

  startGame() {
    // this.getWord();
    this.word = words[Math.round(Math.random() * words.length)];
    this.guesses.replace(new Array(6).fill(""));
    this.numberOfGuesses = 0;
    this.totalScore = 0;
  },
  submitGuess() {
    this.error = "";
    if (words.includes(this.currentGuess)) {
      this.numberOfGuesses += 1;
    } else {
      this.error = "Not a valid word";
    }
    if (this.roundComplete) {
      this.handleStats();
    }
  },

  handleKeyup(e) {
    if (this.roundComplete) {
      return;
    }
    if (e.key === "Enter") {
      return this.submitGuess();
    }
    if (e.key === "Backspace") {
      this.error = "";
      this.guesses[this.numberOfGuesses] = this.currentGuess.slice(
        0,
        this.currentGuess.length - 1
      );
      return;
    }
    if (
      !this.roundComplete &&
      e.key.match(/^[a-z]$/) &&
      this.currentGuess.length < this.word.length
    ) {
      this.guesses[this.numberOfGuesses] =
        this.currentGuess + e.key.toLowerCase();
    }
  },

  handleKeyClick(key) {
    if (this.roundComplete) {
      return;
    }
    if (key === "enter") {
      return this.submitGuess();
    }
    if (key === "delete") {
      this.error = "";
      this.guesses[this.numberOfGuesses] = this.currentGuess.slice(
        0,
        this.currentGuess.length - 1
      );
      return;
    }
    if (this.currentGuess.length < this.word.length) {
      this.guesses[this.numberOfGuesses] =
        this.currentGuess + key.toLowerCase();
    }
  },

  handleStats() {
    this.calculateScore();

    if (typeof window !== "undefined") {
      let stats = JSON.parse(localStorage.getItem("stats"));
      if (stats === null)
        stats = {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
          totalScore: 0,
          avgScore: 0,
          avgTurns: 0,
        };

      if (this.won) {
        stats.wins += 1;
      }
      if (this.lost) {
        stats.losses += 1;
      }
      stats.gamesPlayed += 1;
      stats.totalScore = stats.totalScore + this.totalScore;
      const turns = (stats.avgTurns + this.numberOfGuesses) / stats.gamesPlayed;
      stats.avgTurns = Math.round((turns * 10) / 10);
      stats.avgScore = Math.round(stats.totalScore / stats.gamesPlayed);

      localStorage.setItem("stats", JSON.stringify(stats));
    }
  },
  calculateScore() {
    const unUsedLetters = (30 - this.allGuessedLetters.length) * 4;
    this.totalScore = unUsedLetters + this.correctLetters.length * 2;
    this.scorePercentage = (this.totalScore / 110) * 100;
    console.log(this.scorePercentage);
    console.log(Math.round(this.scorePercentage));
  },
  async getWord() {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      },
    };
    const response = await fetch(
      "https://random-words5.p.rapidapi.com/getRandom?wordLength=5",
      options
    );
    console.log(response);
    const word = await response.text();
    this.word = word;
  },
};
