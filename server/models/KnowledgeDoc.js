import mongoose from "mongoose";

// One record per PDF uploaded in the admin Knowledge Base manager. The raw
// file lives in Cloudinary (so admins can preview/download it); the text
// pulled out of it lives as KnowledgeChunk documents used for retrieval.
const knowledgeDocSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, trim: true },
    cloudinaryUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    sizeBytes: { type: Number, default: 0 },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    chunkCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    error: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("KnowledgeDoc", knowledgeDocSchema);
