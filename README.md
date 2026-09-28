# @absolute-scenes/book-model

Pure book-editing operations shared by `absolute-scenes` (desktop),
`absolute-scenes-mobile`, and `absolute-scenes-mcp`. No GitHub I/O, no UI
framework, no file persistence — every export is a plain function that takes
a book (or scene) object and returns a new one.

## Conventions

- **Shape:** almost every export is `operationName(book, ...args) => newBook`.
  Exceptions: `createDefaultBook()` (no book argument), `recoverBook(rawData)`
  (sanitizes external data), the `getCurrentX` queries (read-only, return the
  item or `null`), and the revision operations in `revisions.js` (operate on
  a `scene`, not a `book` — combine with `updateScene` to write back).
- **Errors:** mutation functions throw a descriptive `Error` for invalid
  input (unknown id, out-of-range index, empty required string) rather than
  silently returning the input unchanged. The `getCurrentX` queries are the
  deliberate exception — "not found" is an expected, non-error result for a
  lookup, and they return `null`.
- **IDs:** every new entity's id comes from `newId()` — a collision-resistant
  base36 timestamp + counter + random suffix, not `Date.now().toString()`.
- **"Add" operations:** always append and return only `newBook`; the new
  entity is the last item of the relevant array (e.g.
  `book.chapters[book.chapters.length - 1]` after `addChapter`).

## Modules

| Module | Covers |
| --- | --- |
| `src/ids.js` | `newId`, `now`, `touch` |
| `src/normalizeContent.js` | Line-ending normalization |
| `src/recovery.js` | `createDefaultBook`, `recoverBook` |
| `src/bookMetadata.js` | Book title/author, template, GitHub bookkeeping fields |
| `src/scenes.js` | Scene CRUD, move between chapters, reorder within a chapter |
| `src/chapters.js` | Chapter CRUD, reorder |
| `src/characters.js`, `src/locations.js` | Character and location CRUD |
| `src/parts.js` | Part CRUD, reorder, and chapter-to-part assignment |
| `src/documents.js` | Background documents and folders |
| `src/frontMatter.js`, `src/backMatter.js`, `src/illustrations.js` | Front/back matter and illustration CRUD, enable/disable, reorder |
| `src/queries.js` | Read-only `getCurrentX` lookups |
| `src/drafts.js` | Whole-book drafts (create, switch, rename, delete, list) |
| `src/revisions.js` | Per-scene revisions (create, switch, rename, delete) |

## Known differences from where this logic used to live

- Ported from `absolute-scenes`'s `src/hooks/useBookState.js`,
  `src/utils/draftOperations.js`, and `src/utils/revisionOperations.js`.
  Consumers migrating onto this package (desktop, mobile) should read each
  module's file for behavior changes made during extraction — most notably,
  everything here throws on invalid input where the original sometimes
  silently no-op'd, `createDraft` no longer returns a `{ book, draftId }`
  tuple, and `moveSceneBetweenChapters` no longer silently drops a scene
  when the target chapter doesn't exist.
