import mongoose from "mongoose";

// Each chunk is a ~450-word slice of text plus its embedding vector. The
// bot's retrieval step scans these to find the passages most relevant to a
// student's question. `source` lets us mix content from uploaded PDFs with
// (optionally, later) auto-ingested Courses/Notices/FAQs in the same index.
const knowledgeChunkSchema = new mongoose.Schema(
  {
    docId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KnowledgeDoc",
      required: true,
      index: true,
    },
    chunkIndex: { type: Number, required: true },
    text: { type: String, required: true },
    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "embedding must be a non-empty array",
      },
    },
    source: { type: String, default: "pdf" },
    filename: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("KnowledgeChunk", knowledgeChunkSchema);
