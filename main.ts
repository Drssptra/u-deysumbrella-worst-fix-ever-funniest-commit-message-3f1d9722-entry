// u-deysumbrella-worst-fix-ever-funniest-commit-message-3f1d9722 entry
// (Node 22, standard library only).
// Writes exactly one original one-line commit message to
// /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt outside the
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

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MESSAGE =
  'fix: remove unused variable; it was the load balancer';

// Deterministic gate: one line, 1-100 Unicode code points, not blank.
const MESSAGE_LENGTH = [...MESSAGE].length;
if (
  MESSAGE.includes('\n') ||
  MESSAGE_LENGTH < 1 ||
  MESSAGE_LENGTH > 100 ||
  MESSAGE.trim().length === 0
) {
  throw new Error('Message must be a single line of 1-100 characters.');
}

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), MESSAGE, 'utf8');
