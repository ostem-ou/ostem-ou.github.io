// oSTEM @ OU — content source config
//
// This is the ONE file future officers need to touch to update the
// team and events pages — no HTML or CSS editing required.
//
// How to wire it up:
//   1. Make a copy of the officer-transition Google Sheet (ask the
//      outgoing Marketing/Web chair for the link, or start a new one
//      with two tabs — "Team" and "Events" — using the column names
//      documented in README.md under "For future officers").
//   2. For each tab: File > Share > Publish to web > select that
//      sheet/tab > format "Comma-separated values (.csv)" > Publish.
//   3. Paste the two resulting URLs below, between the quotes.
//
// Leave a URL blank (as it is now) and that page just shows its
// built-in placeholder content instead — nothing breaks.
//
window.OSTEM_CONFIG = {
  teamCsvUrl: '',
  eventsCsvUrl: '',
};
