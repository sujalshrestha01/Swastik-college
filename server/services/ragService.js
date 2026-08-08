import ai, { MODELS } from "../config/gemini.js";
import { embedQuery } from "../utils/embeddings.js";
import { retrieveRelevantChunks } from "../utils/vectorSearch.js";
import { generateWithFallback } from "../utils/withRetry.js";

const SYSTEM_INSTRUCTION = `You are the admissions & college-info assistant on a college website's chat widget.

Rules:
- Answer ONLY using the information given to you in the CONTEXT section below. Never invent facts, dates, fees, or requirements that aren't in the context.
- If the context doesn't contain the answer, say you're not sure and suggest the student type "chat with admin" to reach a real admissions officer. Do not guess.
- Keep answers short, friendly, and to the point — this is a chat widget, not an essay.
- Never mention "context", "chunks", "the document", or anything about how you're retrieving information. Just answer like a knowledgeable staff member would.`;

const NO_CONTEXT_FALLBACK =
  "I don't have information on that yet. You can type \"chat with admin\" and one of our admissions staff will help you directly.";

// Below this similarity score, the best-matching chunk still isn't a good
// enough match to answer from — better to say "I don't know" than to force
// an answer out of loosely-related text.
const MIN_RELEVANCE_SCORE = 0.55;

export async function answerStudentQuestion(question) {
  const queryEmbedding = await embedQuery(question);
  const chunks = await retrieveRelevantChunks(queryEmbedding, 5);

  const relevantChunks = chunks.filter((c) => c.score >= MIN_RELEVANCE_SCORE);

  if (relevantChunks.length === 0) {
    return { answer: NO_CONTEXT_FALLBACK, usedChunkIds: [] };
  }

  const context = relevantChunks
    .map((c, i) => `[${i + 1}] ${c.text}`)
    .join("\n\n");

  const prompt = `CONTEXT:\n${context}\n\nSTUDENT QUESTION: ${question}`;

 const response = await generateWithFallback(
    ai,
    {
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    },
    MODELS.CHAT_FALLBACK_CHAIN,
  );

  return {
    answer: response.text?.trim() || NO_CONTEXT_FALLBACK,
    usedChunkIds: relevantChunks.map((c) => c._id),
  };
}
