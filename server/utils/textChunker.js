// Splits text into overlapping word-based chunks. Word count (not token
// count) is a fine approximation here — simple, dependency-free, and close
// enough for chunk sizes this small.
//
// ~450 words per chunk keeps each chunk well under embedding model limits
// while staying large enough to hold a full paragraph of context. The
// 50-word overlap prevents a fact from being awkwardly split exactly at a
// chunk boundary and becoming unretrievable from either side.
export function chunkText(text, { chunkSize = 450, overlap = 50 } = {}) {
  const words = text
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) return [];

  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    chunks.push(words.slice(start, end).join(" "));
    if (end === words.length) break;
    start = end - overlap;
  }
  return chunks;
}
