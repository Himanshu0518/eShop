-- This is an empty migration.

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the ProductEmbedding table
CREATE TABLE "ProductEmbedding" (
  id SERIAL PRIMARY KEY,
  "productId" INTEGER NOT NULL UNIQUE REFERENCES "Product"(id) ON DELETE CASCADE,
  embedding VECTOR(768),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index for vector similarity search (optional but recommended)
CREATE INDEX ON "ProductEmbedding" USING ivfflat (embedding vector_cosine_ops);