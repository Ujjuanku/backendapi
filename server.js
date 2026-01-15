import express from "express";
import cors from "cors";
import { execFile } from "child_process";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/query", (req, res) => {
  const { query, mode } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query missing" });
  }

  execFile(
    "python3",
    ["api_query.py", JSON.stringify({ query, mode })],
    { cwd: "../astra-mini-rag" },
    (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        return res.status(500).json({ error: "RAG execution failed" });
      }

      try {
        const data = JSON.parse(stdout);
        res.json(data);
      } catch {
        res.status(500).json({ error: "Invalid RAG response" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("🚀 Backend listening on http://localhost:3001");
});
