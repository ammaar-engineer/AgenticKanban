import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppDataSource, initializeDatabase } from "./config/database.config.js";
import { agents } from "./routes/agents/controllers.js";
import { providers } from "./routes/providers/controllers.js";
import { kanbanBoards } from "./routes/kanban.boards/controllers.js";
import { kanbanLayers } from "./routes/kanban.layers/controllers.js";
import { kanbanAgents } from "./routes/kanban.agents/controllers.js";
import type { StandardResponse } from "./types/standard.response.js";
import { CustomError } from "./utils/custom.httpexception.js";

const app = new Hono();

app.use(cors());

try {
  await initializeDatabase();
} catch (err) {
  console.error("[DB] Failed to connect:", err);
  process.exit(1);
}

app.route("/providers", providers);
app.route("/agents", agents);
app.route("/kanban-boards", kanbanBoards);
app.route("/kanban-layers", kanbanLayers);
app.route("/kanban-agents", kanbanAgents);

app.onError((err, c) => {
  const method = c.req.method;
  const path = c.req.path;

  if (err instanceof CustomError) {
    console.error(`[Error] ${method} ${path} → ${err.statusCode} ${err.errorCode}: ${err.message}`);
    const ReturnJson: StandardResponse = {
      data: null,
      errorCode: err.errorCode,
      message: err.message,
      statusCode: err.statusCode,
      success: false,
    };
    return c.json(ReturnJson, err.statusCode as any);
  }

  console.error(`[Unhandled] ${method} ${path}`, err);
  return c.json({ success: false, message: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`[Server] Running on http://localhost:${info.port}`);
  },
);

export { AppDataSource };
