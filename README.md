# @absolute-scenes/book-model

Pure book-editing operations shared by `absolute-scenes` (desktop),
`absolute-scenes-mobile`, and `absolute-scenes-mcp`. No GitHub I/O, no UI
framework, no file persistence — every export is a plain function that takes
a book (or scene) object and returns a new one.

## Install

Pinned to a tag via GitHub, the same pattern `@absolute-scenes/git-sync`'s
consumers use (see mobile's `package.json`, which pins
`"@absolute-scenes/git-sync": "github:orinoco77/absolute-scenes-git-sync#v0.2.4"`):

```json
"@absolute-scenes/book-model": "github:orinoco77/absolute-scenes-book-model#vX.Y.Z"
```

Replace `vX.Y.Z` with the tag you want to pin to.

## Book shape

The top-level object every mutation function takes as `book` looks roughly
like this (see `src/recovery.js`'s `createDefaultBook` for the authoritative
shape, including template/GitHub/collaboration fields not covered here):

```js
{
  title, author,
  chapters: [
    { id, title, assignedAuthor, scenes: [
      {
        id, title, content, notes, created, modified, assignedAuthor,
        // optional revision history:
        activeRevision: { id, label, created },
        revisions: [{ id, label, created, content }]
      }
    ] }
  ],
  parts: [
    { id, title, chapterIds: [/* chapter id strings */] }
  ],
  characters: [ { id, ... } ],
  locations: [ { id, ... } ],
  backgroundFolders: [
    { id, title, documents: [ { id, title, content, created, modified } ] }
  ],
  frontMatter: [ { id, type, content, enabled } ],
  backMatter: [ { id, type, content, enabled } ],
  illustrations: [ { id, ... } ],
  activeDraft: { id, name, created },   // the currently-live draft's identity
  drafts: [
    { id, name, created, chapters: [ /* full chapters tree */ ], parts: [ /* full parts tree */ ] }
  ],
  metadata: { created, modified }
}
```

Key points on the shape:

- **`chapters[].scenes[]`** is the primary content tree. Chapters hold their
  own scenes directly.
- **`parts[].chapterIds`** is a flat list of chapter id *strings*, not
  embedded chapter objects. It's how chapters are optionally grouped into
  parts for display/export ordering. See "loose references" below.
- **`characters[]`** and **`locations[]`** are flat lists of story-bible
  entries, independent of the chapter tree.
- **`backgroundFolders[].documents[]`** holds free-form research/notes
  documents, grouped into folders.
- **`frontMatter[]`**, **`backMatter[]`**, and **`illustrations[]`** are flat
  lists of front-of-book/back-of-book/illustration items, each with its own
  `enabled` flag (front/back matter) for export toggling.
- **`activeDraft` / `drafts[]`** implement whole-book drafts: `drafts[]`
  holds *parked* drafts, each with its own complete `chapters`/`parts` tree
  frozen at the point it was created or last active. The book's live
  `chapters`/`parts` always belong to whichever draft is active
  (`activeDraft`); switching drafts swaps the live tree with a parked one
  (see `src/drafts.js`).
- **Scenes' own `activeRevision` / `revisions[]`** implement per-scene text
  history, independent of drafts: a scene's `content` is always the active
  revision's text, and `revisions[]` holds parked alternate versions of that
  one scene (see `src/revisions.js`). A scene with no `activeRevision` yet is
  treated as having an implicit "Revision 1" synthesized on read.

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
- **Error message format:** most not-found errors are
  `` `<Entity> not found: <id>` `` (e.g. `Part not found: p1`,
  `Chapter not found: ch1`), so callers that want to match on the entity type
  can do so. The two deliberate exceptions are `deleteDraft` and
  `deleteRevision`, which throw a bare `'Draft not found'` /
  `'Revision not found'` with **no id interpolated** — preserved from the
  original source as an intentional inconsistency, not an oversight. Don't
  assume every not-found message has an id suffix.
- **`updateFrontMatter`, `updateBackMatter`, `updateIllustration` replace,
  they don't merge.** Unlike every other `updateX` function in this package
  (which merge a partial `updates` object into the existing item), these
  three take a *complete replacement item* and swap it in wholesale. A
  caller must pass the full item, including its `id` — passing a partial
  object will silently make the item unfindable by id afterward, since
  nothing preserves the original `id` for you. This matches the original
  source's behavior but is an easy trap to fall into.
- **IDs:** every new entity's id comes from `newId()` — a collision-resistant
  base36 timestamp + counter + random suffix, not `Date.now().toString()`
  like the original source used. This is a **migration-awareness item**: if
  any existing test fixtures or stored data (desktop, mobile) assert on the
  literal id format or shape, they'll need updating when moving onto this
  package.
- **`part.chapterIds` is a loose, decoupled reference list** — it is not
  cross-validated against `book.chapters`. Nothing in this package keeps the
  two in sync automatically: for example, `deleteChapter` does **not** also
  remove the deleted chapter's id from any part's `chapterIds`, and
  `moveChapterToPart`/`addChapterToPart` don't verify the chapter id actually
  exists in `book.chapters`. Callers that care about consistency between
  `chapters` and `parts` need to enforce it themselves.
- **"Add" operations:** always append and return only `newBook`; the new
  entity is the last item of the relevant array (e.g.
  `book.chapters[book.chapters.length - 1]` after `addChapter`).

## Modules

Only the functions actually re-exported from `index.js` are public API. The
table below marks internal helpers (not exported from `index.js`) in
*italics* — they're implementation details of their module, not something a
consumer should import directly.

| Module | Public exports | Internal helpers |
| --- | --- | --- |
| `src/ids.js` | `newId` | *`now`, `touch`* |
| `src/normalizeContent.js` | `normalizeContent` | |
| `src/recovery.js` | `createDefaultBook`, `recoverBook` | |
| `src/bookMetadata.js` | `updateBookMetadata`, `updateTemplate`, `updateGitHubSettings`, `updateGitHubSyncStatus` | |
| `src/scenes.js` | `updateScene`, `addScene`, `deleteScene`, `moveSceneBetweenChapters`, `reorderScenesInChapter` | |
| `src/chapters.js` | `addChapter`, `updateChapter`, `deleteChapter`, `reorderChapters` | |
| `src/characters.js`, `src/locations.js` | Character and location CRUD | |
| `src/parts.js` | `addPart`, `updatePart`, `deletePart`, `reorderParts`, `moveChapterToPart`, `addChapterToPart`, `removeChapterFromPart`, `reorderChaptersInPart` | |
| `src/documents.js` | Background documents and folders | |
| `src/frontMatter.js`, `src/backMatter.js`, `src/illustrations.js` | Front/back matter and illustration CRUD, enable/disable, reorder | |
| `src/queries.js` | `getCurrentScene`, `getCurrentCharacter`, `getCurrentDocument`, `getCurrentLocation`, `getCurrentFrontMatter`, `getCurrentBackMatter`, `getCurrentIllustration` | |
| `src/drafts.js` | `getActiveDraft`, `listDrafts`, `getExportBook`, `createDraft`, `switchDraft`, `renameDraft`, `deleteDraft` | |
| `src/revisions.js` | `getRevisionInfo`, `createRevision`, `switchRevision`, `renameRevision`, `deleteRevision` | |
| `src/indexRange.js` | *(none)* | *`requireValidIndex`* — shared integer-range check used by every `reorderX` function |

## Known differences from where this logic used to live

- Ported from `absolute-scenes`'s `src/hooks/useBookState.js`,
  `src/utils/draftOperations.js`, and `src/utils/revisionOperations.js`.
  Consumers migrating onto this package (desktop, mobile) should read each
  module's file for behavior changes made during extraction — most notably:
  - Everything here throws on invalid input where the original sometimes
    silently no-op'd.
  - `createDraft` no longer returns a `{ book, draftId }` tuple — it returns
    `newBook` only, like every other mutation function.
  - `moveSceneBetweenChapters` no longer silently drops a scene when the
    target chapter doesn't exist; it throws instead.
  - `moveChapterToPart` no longer silently drops a chapter when moving it
    within the same part (`fromPartId === toPartId`) — this was fixed during
    the extraction's final review and is now covered by a regression test.
  - All six `reorderX` functions (`reorderScenesInChapter`,
    `reorderChapters`, `reorderParts`, `reorderChaptersInPart`,
    `reorderFrontMatter`, `reorderBackMatter`) now reject non-integer indices
    (`undefined`, `NaN`, floats, numeric strings) instead of silently
    coercing them, via the shared `requireValidIndex` helper in
    `src/indexRange.js`. This matters once an MCP agent is passing indices
    parsed from JSON, where a missing or malformed index is easy to produce
    by accident.
  - IDs use `newId()` (collision-resistant) instead of
    `Date.now().toString()` — see the migration-awareness note under
    Conventions.
