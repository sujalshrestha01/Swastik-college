import KnowledgeChunk from "../models/KnowledgeChunk.js";

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

// Plain in-app cosine similarity over every stored chunk. This is the
// deliberately simple choice: for a single college's knowledge base (a few
// hundred to a few thousand chunks), scanning them all in memory takes low
// tens of milliseconds and needs zero extra setup — no Atlas Search vector
// index to create in the Atlas UI, no second database. If the knowledge
// base ever grows into the tens of thousands of chunks, swap this for a
// Mongo Atlas $vectorSearch aggregation stage without touching any other
// file — retrieveRelevantChunks() is the only place that needs to change.
export async function retrieveRelevantChunks(queryEmbedding, topK = 5) {
  const chunks = await KnowledgeChunk.find(
    {},
    { text: 1, embedding: 1, filename: 1, docId: 1 },
  ).lean();

  if (chunks.length === 0) return [];

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
