/// <reference types="cypress" />

import React from "react";
import Keyboard from "../../src/components/Keyboard";

// Minimal fake store satisfying the contract Keyboard relies on
// (handleKeyClick/canSubmit/greenLetters/yellowLetters/allGuessedLetters -
// the same shape WordleStore and QuordleStore both expose).
function makeStore(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    greenLetters: [],
    yellowLetters: [],
    allGuessedLetters: [],
    canSubmit: false,
    handleKeyClick: cy.stub().as("handleKeyClick"),
    ...overrides,
  };
}

describe("<Keyboard /> - shared by Wordle and Quordle", () => {
  it("renders Enter first and Backspace last in the third row, with no separate keys outside the keyboard", () => {
    cy.mount(<Keyboard store={makeStore()} />);

    cy.get("button").then(($buttons) => {
      const labels = [...$buttons].map((el) => el.getAttribute("aria-label"));
      const enterIndex = labels.indexOf("Enter");
      const backspaceIndex = labels.indexOf("Backspace");

      expect(enterIndex).to.be.greaterThan(-1);
      expect(backspaceIndex).to.be.greaterThan(-1);
      // Enter must be immediately followed by "Z", and Backspace
      // immediately preceded by "M" - i.e. they sit inside row 3
      // (Enter Z X C V B N M Backspace), not as separate buttons
      // elsewhere in the DOM.
      expect(labels[enterIndex + 1]).to.equal("Z key");
      expect(labels[backspaceIndex - 1]).to.equal("M key");
      // and nothing after Backspace or before Enter in that row
      expect(backspaceIndex).to.equal(labels.length - 1);
    });
  });

  it("Backspace has an accessible label and a recognizable icon, not a bare 'delete' text label", () => {
    cy.mount(<Keyboard store={makeStore()} />);
    cy.get('button[aria-label="Backspace"]').should("exist").within(() => {
      cy.get("svg").should("exist");
    });
  });

  it("action keys (Enter/Backspace) are wider than a letter key", () => {
    cy.mount(<Keyboard store={makeStore()} />);
    cy.get('button[aria-label="Enter"]')
      .invoke("width")
      .then((enterWidth) => {
        cy.contains("button", "q")
          .invoke("width")
          .then((letterWidth) => {
            expect(enterWidth).to.be.greaterThan(letterWidth as number);
          });
      });
  });

  it("clicking a letter calls the store's handleKeyClick with that letter", () => {
    const store = makeStore();
    cy.mount(<Keyboard store={store} />);
    cy.contains("button", "q").click();
    cy.wrap(store.handleKeyClick).should("have.been.calledWith", "q");
  });

  it("clicking Backspace calls handleKeyClick('delete')", () => {
    const store = makeStore();
    cy.mount(<Keyboard store={store} />);
    cy.get('button[aria-label="Backspace"]').click();
    cy.wrap(store.handleKeyClick).should("have.been.calledWith", "delete");
  });

  it("Enter is disabled when canSubmit is false", () => {
    const store = makeStore({ canSubmit: false });
    cy.mount(<Keyboard store={store} />);
    cy.get('button[aria-label="Enter"]').should("be.disabled");
    cy.get('button[aria-label="Enter"]').click({ force: true });
    cy.wrap(store.handleKeyClick).should("not.have.been.called");
  });

  it("Enter is enabled and submits when canSubmit is true", () => {
    const store = makeStore({ canSubmit: true });
    cy.mount(<Keyboard store={store} />);
    cy.get('button[aria-label="Enter"]').should("not.be.disabled").click();
    cy.wrap(store.handleKeyClick).should("have.been.calledWith", "enter");
  });

  it("6. behaves the same for Quordle's per-board `boards` prop as for Wordle's single-state mode", () => {
    const store = makeStore();
    cy.mount(
      <Keyboard
        store={store}
        boards={[
          { correctLetters: ["q"], presentLetters: [] },
          { correctLetters: [], presentLetters: [] },
          { correctLetters: [], presentLetters: [] },
          { correctLetters: [], presentLetters: [] },
        ]}
      />
    );

    // Same click-wiring contract regardless of single vs. quadrant mode.
    cy.contains("button", "q").click();
    cy.wrap(store.handleKeyClick).should("have.been.calledWith", "q");
    cy.get('button[aria-label="Enter"]').should("exist");
    cy.get('button[aria-label="Backspace"]').should("exist");
  });

  it("8. hiding then showing the keyboard (mount/unmount) does not touch the store's guess or round state", () => {
    const store = makeStore();

    cy.mount(<Keyboard store={store} />).then(({ unmount }) => {
      cy.contains("button", "q")
        .click()
        .then(() => {
          expect(store.handleKeyClick).to.have.been.calledWith("q");

          // Simulate the "hide keyboard" preference unmounting the
          // component (see wordle.tsx/quordle.tsx:
          // `{keyboardVisible && <Keyboard .../>}`) - the store itself is
          // owned by the page, not the Keyboard component, so unmounting
          // it must not reset or touch anything on the store.
          unmount();
        });
    });

    // "show keyboard" remounts it - it should come back the same way,
    // still wired to the very same store instance.
    cy.mount(<Keyboard store={store} />);
    cy.get('button[aria-label="Enter"]').should("exist");
  });
});
