// u-deysumbrella-worst-fix-ever-funniest-commit-message-3f1d9722 entry
// (Node 22, standard library only).
// Writes exactly one original one-line commit message to
// $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt outside the
// grader). No trailing newline: the judge reads exactly the bytes
// written. Gate: the file must be UTF-8, one line, 1-100 characters,
// not only whitespace, and both grader runs must write the same
// bytes — so the message is a fixed string, never random, never
// generated at runtime.
//
// The message: a cleanup commit deletes an "unused" variable that
// turns out to be the load balancer. The fix is the disaster: the
// thing removed as dead weight was the thing holding production
// up. One concrete scene, one turn, no setup that explains itself.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Entry text
// ---------------------------------------------------------------------------

/** The single fixed entry: the funniest commit message. Never random. */
const ENTRY_TEXT = 'fix: remove unused variable; it was the load balancer';

/** Returns the entry text exactly as submitted. */
function entryText(): string {
  return ENTRY_TEXT;
}

// ---------------------------------------------------------------------------
// Gate validation (competition.yaml: 1-100 chars, single line, UTF-8,
// not only whitespace)
// ---------------------------------------------------------------------------

/** Checks the gate and returns the list of violations (empty = valid). */
function validateGate(text: string): string[] {
  const violations: string[] = [];
  const length = [...text].length;
  if (text.includes('\n') || text.includes('\r')) {
    violations.push('entry must be a single line');
  }
  if (length < 1 || length > 100) {
    violations.push(`entry must be 1-100 characters (got ${length})`);
  }
  if (text.trim().length === 0) {
    violations.push('entry must not be only whitespace');
  }
  // The entry must survive a strict UTF-8 round trip unchanged, so any
  // lone surrogate or invalid sequence is caught before it is written.
  const encoded = new TextEncoder().encode(text);
  const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
  if (decoded !== text) {
    violations.push('entry must be valid UTF-8');
  }
  // Control characters other than a horizontal tab have no place in a
  // one-line commit message.
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 && ch !== '\t') {
      violations.push('entry must not contain control characters');
      break;
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------
// Output handling
// ---------------------------------------------------------------------------

/** Resolves the output directory: $MAKEFUN_OUTPUT_DIR, else /output. */
function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv.length > 0
    ? resolve(fromEnv)
    : '/output';
}

/**
 * Writes the entry to entry.txt inside the output directory, creating
 * the directory when needed. No trailing newline is added, so the file
 * contains exactly the entry bytes.
 */
function writeEntryFile(dir: string, text: string): string {
  mkdirSync(dir, { recursive: true });
  const target = join(dir, 'entry.txt');
  writeFileSync(target, text, 'utf8');
  return target;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const text = entryText();

  const violations = validateGate(text);
  if (violations.length > 0) {
    throw new Error(`Entry fails the gate: ${violations.join('; ')}`);
  }

  const dir = outputDir();
  const target = writeEntryFile(dir, text);

  // Read back and confirm the on-disk bytes match the entry exactly.
  const written = readFileSync(target, 'utf8');
  if (written !== text) {
    throw new Error('entry.txt does not match the entry text');
  }
}

main();
