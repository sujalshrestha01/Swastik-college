import ai, { MODELS } from "../config/gemini.js";

// Retries on rate-limit / transient errors with exponential backoff, so a
// burst of PDF chunks (or a momentary blip) doesn't just fail outright on
// the free tier's tighter per-minute limits.
async function withRetry(fn, { retries = 4, baseDelayMs = 1000 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const status = err?.status ?? err?.code;
      const isRetryable =
        status === 429 ||
        status === 503 ||
        /rate|quota|overloaded|unavailable/i.test(err?.message || "");
      if (!isRetryable || attempt === retries) throw err;
      const delay = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastErr;
}

// Embeds many chunks (e.g. all chunks from one uploaded PDF) for storage.
// Batched to stay well under per-request payload limits and to make retries
// cheap (only re-send the failed batch, not the whole document).
export async function embedDocumentChunks(texts, batchSize = 20) {
  const allEmbeddings = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await withRetry(() =>
      ai.models.embedContent({
        model: MODELS.EMBEDDING,
        contents: batch,
        config: { taskType: "RETRIEVAL_DOCUMENT" },
      }),
    );
    for (const embedding of response.embeddings) {
      allEmbeddings.push(embedding.values);
    }
  }
  return allEmbeddings;
}

// Embeds a single student question at query time.
export async function embedQuery(text) {
  const response = await withRetry(() =>
    ai.models.embedContent({
      model: MODELS.EMBEDDING,
      contents: [text],
      config: { taskType: "RETRIEVAL_QUERY" },
    }),
  );
  return response.embeddings[0].values;
}
