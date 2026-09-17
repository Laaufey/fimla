/// <reference types="cypress" />

import QuordleStore from "../../src/stores/QuordleStore.jsx";
import words from "../../src/data/fiveLetterWords.json";

// Coverage for the shared on-screen keyboard's contract with
// QuordleStore. Also a regression test for a real bug found while fixing
// the keyboard: handleKeyClick (the on-screen keyboard's entry point)
// only ever typed letters into board 1 - guesses2/3/4 never received
// on-screen keystrokes at all, even though the physical-keyboard path
// (handleKeyup) correctly fanned out to all four boards.
describe("QuordleStore - keyboard input (on-screen + physical)", () => {
  const reset = () => {
    QuordleStore.word1 = "apple";
    QuordleStore.word2 = "crane";
    QuordleStore.word3 = "stone";
    QuordleStore.word4 = "grape";
    QuordleStore.guesses = new Array(9).fill("");
    QuordleStore.guesses2 = new Array(9).fill("");
    QuordleStore.guesses3 = new Array(9).fill("");
    QuordleStore.guesses4 = new Array(9).fill("");
    QuordleStore.currentGuess = 0;
    QuordleStore.currentGuess2 = 0;
    QuordleStore.currentGuess3 = 0;
    QuordleStore.currentGuess4 = 0;
    QuordleStore.error = "";
  };

  beforeEach(reset);

  it("1. clicking a letter adds it to every active board's current guess (regression: used to only reach board 1)", () => {
    QuordleStore.handleKeyClick("c");
    QuordleStore.handleKeyClick("h");

    expect(QuordleStore.guesses[0]).to.equal("ch");
    expect(QuordleStore.guesses2[0]).to.equal("ch");
    expect(QuordleStore.guesses3[0]).to.equal("ch");
    expect(QuordleStore.guesses4[0]).to.equal("ch");
  });

  it("2. clicking Backspace removes only the final character, from every active board", () => {
    QuordleStore.guesses[0] = "cha";
    QuordleStore.guesses2[0] = "cha";
    QuordleStore.guesses3[0] = "cha";
    QuordleStore.guesses4[0] = "cha";

    QuordleStore.handleKeyClick("delete");

    expect(QuordleStore.guesses[0]).to.equal("ch");
    expect(QuordleStore.guesses2[0]).to.equal("ch");
    expect(QuordleStore.guesses3[0]).to.equal("ch");
    expect(QuordleStore.guesses4[0]).to.equal("ch");
  });

  it("3. Backspace on an empty guess is safe", () => {
    QuordleStore.handleKeyClick("delete");
    expect(QuordleStore.guesses[0]).to.equal("");
    expect(QuordleStore.error).to.equal("");
  });

  it("4. clicking Enter submits a valid guess for every active board", () => {
    expect(words).to.include("chair");
    for (const letter of "chair") QuordleStore.handleKeyClick(letter);
    expect(QuordleStore.canSubmit).to.equal(true);

    QuordleStore.handleKeyClick("enter");

    expect(QuordleStore.currentGuess).to.equal(1);
    expect(QuordleStore.currentGuess2).to.equal(1);
    expect(QuordleStore.currentGuess3).to.equal(1);
    expect(QuordleStore.currentGuess4).to.equal(1);
    expect(QuordleStore.error).to.equal("");
  });

  it("5a. an incomplete guess cannot submit (canSubmit is false, Enter is a no-op)", () => {
    QuordleStore.handleKeyClick("c");
    QuordleStore.handleKeyClick("h");
    expect(QuordleStore.canSubmit).to.equal(false);

    QuordleStore.handleKeyClick("enter");

    expect(QuordleStore.currentGuess).to.equal(0);
  });

  it("5b. a complete but invalid guess is rejected for every board, not partially submitted", () => {
    for (const letter of "zzzzz") QuordleStore.handleKeyClick(letter);

    QuordleStore.handleKeyClick("enter");

    expect(QuordleStore.currentGuess).to.equal(0);
    expect(QuordleStore.currentGuess2).to.equal(0);
    expect(QuordleStore.currentGuess3).to.equal(0);
    expect(QuordleStore.currentGuess4).to.equal(0);
    expect(QuordleStore.error).to.equal("Not a valid word");
  });

  it("regression: a valid guess is not wrongly rejected once one board has already been won", () => {
    // "grape" matches word4 exactly, winning board 4 while 1-3 continue.
    for (const letter of "grape") QuordleStore.handleKeyClick(letter);
    QuordleStore.handleKeyClick("enter");
    expect(QuordleStore.won4).to.equal(true);
    expect(QuordleStore.won1).to.equal(false);

    for (const letter of "stone") QuordleStore.handleKeyClick(letter);
    QuordleStore.handleKeyClick("enter");

    expect(QuordleStore.error).to.equal("");
    expect(QuordleStore.currentGuess).to.equal(2);
  });

  it("7. physical keyboard input (handleKeyup) still fans out to all four boards", () => {
    for (const letter of "chair") QuordleStore.handleKeyup({ key: letter });
    expect(QuordleStore.guesses[0]).to.equal("chair");
    expect(QuordleStore.guesses4[0]).to.equal("chair");

    QuordleStore.handleKeyup({ key: "Enter" });
    expect(QuordleStore.currentGuess).to.equal(1);
    expect(QuordleStore.currentGuess4).to.equal(1);
  });
});
