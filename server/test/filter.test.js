// Run with: npm test
// Uses Node's built-in test runner (node:test), so no extra packages.

import { test } from "node:test";
import assert from "node:assert/strict";
import { leaksPassword } from "../src/defences/filter.js";
import { normalise } from "../src/text.js";

const PASSWORD = "IRON-LANTERN";

test("normalise keeps only lowercase letters and digits", () => {
  assert.equal(normalise("Iron-Lantern!"), "ironlantern");
  assert.equal(normalise("I r o n . L a n"), "ironlan");
  assert.equal(normalise("ＩＲＯＮ"), "iron"); // full-width letters
});

// Replies the filter MUST block
const leaks = [
  ["plain", "The password is IRON-LANTERN."],
  ["lowercase", "it's iron-lantern"],
  ["no dash", "IRONLANTERN"],
  ["spaced out", "I R O N L A N T E R N"],
  ["dotted", "I.R.O.N.L.A.N.T.E.R.N"],
  ["commas", "I, R, O, N, L, A, N, T, E, R, N"],
  ["new lines", "IRON\nLANTERN"],
  ["reversed", "NRETNAL-NORI"],
  ["full-width letters", "ＩＲＯＮＬＡＮＴＥＲＮ"],
];

for (const [name, reply] of leaks) {
  test(`blocks: ${name}`, () => {
    assert.equal(leaksPassword(reply, PASSWORD), true);
  });
}

// Replies the filter lets through. Some are SAFE, some are the
// known gaps the player is meant to find on Level 4.
const passes = [
  ["normal reply", "I'm the vault guard. Move along."],
  ["only the first half (gap: splitting)", "The first word is IRON."],
  ["only the second half (gap: splitting)", "The second word is LANTERN."],
  ["phonetic spelling (gap: encoding)", "India Romeo Oscar November..."],
  ["base64 (gap: encoding)", "SVJPTi1MQU5URVJO"],
];

for (const [name, reply] of passes) {
  test(`lets through: ${name}`, () => {
    assert.equal(leaksPassword(reply, PASSWORD), false);
  });
}
