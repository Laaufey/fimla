/// <reference types="cypress" />

import SpellingBeeStore from "../../src/stores/SpellingBeeStore.jsx";

// Regression coverage for a bug where shuffling the letters (a pure
// reorder) was perceived as "getting new letters" because the letter
// tiles visibly rearranged, and for the follow-up fixes: hints going
// stale after a shuffle, and startGame() ("New puzzle") not clearing all
// puzzle-specific state.
describe("SpellingBeeStore", () => {
  const FIXED_LETTERS = ["e", "y", "l", "i", "b", "m", "j"];

  beforeEach(() => {
    SpellingBeeStore.letters = [...FIXED_LETTERS];
    SpellingBeeStore.fourLetterWords = [];
    SpellingBeeStore.fiveLetterWords = [];
    SpellingBeeStore.allFoundWords = [];
    SpellingBeeStore.error = "";
    SpellingBeeStore.getHints();
  });

  it("shuffle reorders the letters without changing the letter set or clearing found words", () => {
    SpellingBeeStore.fourLetterWords = ["yell"];
    SpellingBeeStore.allFoundWords = ["yell"];

    const letterSetBefore = [...SpellingBeeStore.letters].sort();

    SpellingBeeStore.shuffle(SpellingBeeStore.letters);

    const letterSetAfter = [...SpellingBeeStore.letters].sort();
    expect(letterSetAfter).to.deep.equal(letterSetBefore);
    expect(SpellingBeeStore.letters).to.have.length(7);
    expect(SpellingBeeStore.fourLetterWords).to.deep.equal(["yell"]);
    expect(SpellingBeeStore.allFoundWords).to.deep.equal(["yell"]);
  });

  it("shuffle recomputes hints so they never remain stale for the previous letter order", () => {
    // Plant an obviously stale value: if shuffle forgot to recompute
    // hints, this sentinel would still be sitting there afterwards.
    const staleSentinel = SpellingBeeStore.letters.map(() => ["__stale__"]);
    SpellingBeeStore.fourLetterHints = [...staleSentinel];
    SpellingBeeStore.fiveLetterHints = [...staleSentinel];

    SpellingBeeStore.shuffle(SpellingBeeStore.letters);

    expect(SpellingBeeStore.fourLetterHints).to.not.deep.equal(staleSentinel);
    expect(SpellingBeeStore.fiveLetterHints).to.not.deep.equal(staleSentinel);

    // What shuffle computed must match an independent, fresh recompute for
    // the (now shuffled) letter order - i.e. shuffle already left the
    // hints fully up to date, not just "different from the sentinel".
    const recomputedFour = JSON.parse(
      JSON.stringify(SpellingBeeStore.fourLetterHints)
    );
    const recomputedFive = JSON.parse(
      JSON.stringify(SpellingBeeStore.fiveLetterHints)
    );
    SpellingBeeStore.getHints();

    expect(SpellingBeeStore.fourLetterHints).to.deep.equal(recomputedFour);
    expect(SpellingBeeStore.fiveLetterHints).to.deep.equal(recomputedFive);
  });

  it("New puzzle (startGame) clears all puzzle-specific state", () => {
    SpellingBeeStore.fourLetterWords = ["abcd"];
    SpellingBeeStore.fiveLetterWords = ["abcde"];
    SpellingBeeStore.allFoundWords = ["abcd", "abcde"];
    SpellingBeeStore.error = "Invalid word";

    SpellingBeeStore.startGame();

    expect(SpellingBeeStore.fourLetterWords).to.deep.equal([]);
    expect(SpellingBeeStore.fiveLetterWords).to.deep.equal([]);
    expect(SpellingBeeStore.allFoundWords).to.deep.equal([]);
    expect(SpellingBeeStore.error).to.equal("");
    expect(SpellingBeeStore.letters).to.have.length(7);
    expect(SpellingBeeStore.fourLetterHints).to.have.length(
      SpellingBeeStore.letters.length
    );
    expect(SpellingBeeStore.fiveLetterHints).to.have.length(
      SpellingBeeStore.letters.length
    );
  });

  it("shuffle and startGame bump round, so the letter tiles remount and replay their entrance animation", () => {
    const initialRound = SpellingBeeStore.round;

    SpellingBeeStore.shuffle(SpellingBeeStore.letters);
    expect(SpellingBeeStore.round).to.equal(initialRound + 1);

    SpellingBeeStore.startGame();
    expect(SpellingBeeStore.round).to.equal(initialRound + 2);
  });
});
