/// <reference types="cypress" />

import WordleStore from "../../src/stores/WordleStore.jsx";
import words from "../../src/data/fiveLetterWords.json";

// Coverage for the shared on-screen keyboard's contract with WordleStore:
// handleKeyClick(key) for letters/"enter"/"delete", and canSubmit for
// disabling the Enter key. Also covers handleKeyup, which is what the
// physical keyboard drives (see wordle.tsx's window "keyup" listener).
describe("WordleStore - keyboard input (on-screen + physical)", () => {
  const VALID_GUESS = "apple";
  const ANSWER = "stone";

  beforeEach(() => {
    expect(words).to.include(VALID_GUESS);
    WordleStore.word = ANSWER;
    WordleStore.guesses = new Array(6).fill("");
    WordleStore.numberOfGuesses = 0;
    WordleStore.error = "";
  });

  it("1. clicking a letter adds it to the current guess", () => {
    WordleStore.handleKeyClick("a");
    WordleStore.handleKeyClick("p");
    expect(WordleStore.currentGuess).to.equal("ap");
  });

  it("2. clicking Backspace removes only the final character", () => {
    WordleStore.guesses[0] = "app";
    WordleStore.handleKeyClick("delete");
    expect(WordleStore.currentGuess).to.equal("ap");
  });

  it("3. Backspace on an empty guess is safe", () => {
    expect(WordleStore.currentGuess).to.equal("");
    WordleStore.handleKeyClick("delete");
    expect(WordleStore.currentGuess).to.equal("");
    expect(WordleStore.error).to.equal("");
  });

  it("4. clicking Enter submits a valid, complete guess", () => {
    for (const letter of VALID_GUESS) WordleStore.handleKeyClick(letter);
    expect(WordleStore.canSubmit).to.equal(true);

    WordleStore.handleKeyClick("enter");

    expect(WordleStore.numberOfGuesses).to.equal(1);
    expect(WordleStore.error).to.equal("");
  });

  it("5a. an incomplete guess cannot submit (canSubmit is false, Enter is a no-op)", () => {
    WordleStore.handleKeyClick("a");
    WordleStore.handleKeyClick("p");
    expect(WordleStore.canSubmit).to.equal(false);

    WordleStore.handleKeyClick("enter");

    expect(WordleStore.numberOfGuesses).to.equal(0);
  });

  it("5b. a complete but invalid (not in the word list) guess is rejected, not submitted", () => {
    for (const letter of "zzzzz") WordleStore.handleKeyClick(letter);
    expect(WordleStore.canSubmit).to.equal(true); // right length, so Enter is live

    WordleStore.handleKeyClick("enter");

    expect(WordleStore.numberOfGuesses).to.equal(0);
    expect(WordleStore.error).to.equal("Not a valid word");
  });

  it("Enter/Backspace are ignored once the round is already complete", () => {
    WordleStore.word = VALID_GUESS;
    for (const letter of VALID_GUESS) WordleStore.handleKeyClick(letter);
    WordleStore.handleKeyClick("enter");
    expect(WordleStore.won).to.equal(true);

    WordleStore.handleKeyClick("delete");
    expect(WordleStore.guesses[0]).to.equal(VALID_GUESS);
    expect(WordleStore.canSubmit).to.equal(false);
  });

  it("7. physical keyboard input (handleKeyup) continues to work for letters, Backspace, and Enter", () => {
    for (const letter of VALID_GUESS) WordleStore.handleKeyup({ key: letter });
    expect(WordleStore.currentGuess).to.equal(VALID_GUESS);

    WordleStore.handleKeyup({ key: "Backspace" });
    expect(WordleStore.currentGuess).to.equal(VALID_GUESS.slice(0, -1));

    WordleStore.handleKeyup({ key: VALID_GUESS.slice(-1) });
    WordleStore.handleKeyup({ key: "Enter" });
    expect(WordleStore.numberOfGuesses).to.equal(1);
    expect(WordleStore.error).to.equal("");
  });
});
