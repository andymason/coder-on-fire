/* eslint-disable no-bitwise, no-param-reassign, unicorn/prefer-math-trunc */

/**
 * mulberry32 — a fast, high-quality 32-bit seeded PRNG.
 * Returns a function that produces values in [0, 1] each call.
 */
export function mulberry32(seed: number): () => number {
  // Weil sequence: guarantees the state visits every 32-bit value before repeating
  const WEIL_INCREMENT = 0x6d2b79f5;

  // Xorshift distances for bit mixing — these specific values were chosen by
  // the original author for passing statistical randomness tests
  const SHIFT_A = 15;
  const SHIFT_B = 7;
  const SHIFT_C = 14;

  // Odd multipliers (bitwise OR with 1 forces oddness, critical for quality)
  const MIXER_A = 1;
  const MIXER_B = 61;

  // 2^32 — normalizes the unsigned 32-bit result into [0, 1]
  const UINT32_MAX_PLUS_ONE = 4294967296;

  let state = seed | 0;

  return () => {
    // Advance the Weil sequence counter
    state = (state + WEIL_INCREMENT) | 0;

    // First mixing round: xorshift + multiply
    const roundOne = Math.imul(state ^ (state >>> SHIFT_A), MIXER_A | state);

    // Second mixing round: xorshift-multiply-accumulate + xor
    const roundTwoIntermediate = Math.imul(
      roundOne ^ (roundOne >>> SHIFT_B),
      MIXER_B | roundOne,
    );

    const roundTwo = (roundOne + roundTwoIntermediate) ^ roundOne;

    // Final xorshift, convert to unsigned, normalize to [0, 1]
    return ((roundTwo ^ (roundTwo >>> SHIFT_C)) >>> 0) / UINT32_MAX_PLUS_ONE;
  };
}
