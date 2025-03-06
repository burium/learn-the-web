import { Hono } from "hono";
import { cors } from "hono/cors";

import { smoothStream, streamText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { stream } from "hono/streaming";

import { STOPWORDS } from "./stopwords";

const app = new Hono();

/**
 * Estimates token count from text length (rough approximation)
 * @param {string} text - Input text to estimate
 * @returns {number} - Estimated token count
 */
const estimateTokens = (text) => Math.ceil(text.length / 4);

app.use(
  "/*",
  cors({
    origin: ["https://learn-the-web.vercel.app"],
    allowMethods: ["POST", "OPTIONS"],
    maxAge: 600,
  }),
);

/**
 * AI Assistant API endpoint that processes web development related questions
 *
 * @route POST /api/assistant
 * @param {object} c - Hono context object containing request/response data
 * @returns {Stream} - Text stream containing the AI-generated response
 */
app.post("/api/assistant", async (c) => {
  const { messages } = await c.req.json();

  if (!messages) {
    return c.json({ error: "Missing messages" }, 400);
  }

  const totalTokens = messages.reduce(
    (sum, message) => sum + estimateTokens(message.content || ""),
    0,
  );

  if (totalTokens > 2560) {
    return c.json({ error: "Chat exceeds maximum token limit of 2560" }, 400);
  }

  const ipAddress = c.req.header("cf-connecting-ip");
  const { success } = await c.env.RATE_LIMITER.limit({ key: ipAddress });

  if (!success) {
    return c.json({ error: "Rate limit exceeded" }, 429);
  }

  const workersai = createWorkersAI({
    binding: c.env.AI,
    gateway: {
      id: "learn-the-web",
      skipCache: false,
      cacheTtl: 3360,
    },
  });
  const model = workersai("@cf/meta/llama-3.1-8b-instruct-fp8-fast");

  const result = streamText({
    model,
    system: `You are a helpful web development assistant.
      Provide clear, concise answers about HTML, CSS, JavaScript, and other web technologies including data structures, algorithms, and databases.
      Ensure your answers are accurate and up-to-date.
      Include code examples when relevant.
      Keep your answers focused on web development topics.
      Respond in a friendly and helpful manner.
      Remember to be concise and to the point.`,
    messages,
    maxTokens: 1024, // Maximum tokens to generate
    experimental_transform: smoothStream({
      delayInMs: 20,
      chunking: "line",
    }),
  });

  c.header("Content-Type", "text/x-unknown");
  c.header("content-encoding", "identity");
  c.header("transfer-encoding", "chunked");

  return stream(c, (stream) => stream.pipe(result.toDataStream()));
});

/**
 * Calculates term frequency for given text input
 *
 * @param {string} text - Input text to analyze
 * @returns {Array} - Array of term frequency objects sorted by frequency
 */
function calculateTermFrequency(text) {
  const tokenize = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);
  };

  const removeStopWords = (tokens) =>
    tokens.filter((token) => !STOPWORDS.has(token));

  const calculateTf = (document) => {
    const tokens = removeStopWords(tokenize(document));
    const wordCount = tokens.length;
    const tf = {};

    tokens.forEach((token) => {
      tf[token] = (tf[token] || 0) + 1;
    });

    Object.keys(tf).forEach((token) => {
      tf[token] = tf[token] / wordCount;
    });

    return tf;
  };

  const tf = calculateTf(text);

  const sortedTerms = Object.entries(tf)
    .sort((a, b) => b[1] - a[1])
    .map(([term, score]) => ({ term, score }));

  return sortedTerms;
}

/**
 * Endpoint for text analysis that calculates term frequency
 *
 * @route POST /api/analyze
 * @param {object} c - Hono context object containing request/response data
 * @returns {object} - JSON response with the top 3 most frequent terms
 */
app.post("/api/analyze", async (c) => {
  const { text } = await c.req.json();

  if (!text) {
    return c.json({ error: "Text is required" }, 400);
  }

  try {
    const result = calculateTermFrequency(text);
    return c.json(result.slice(0, 3));
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
