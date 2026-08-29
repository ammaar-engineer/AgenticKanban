import { serve } from "@hono/node-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AppDataSource, initializeDatabase } from "./config/database.config.js";
import { agents } from "./routes/agents/controllers.js";
import { providers } from "./routes/providers/controllers.js";
import { CustomError } from "./utils/custom.httpexception.js";
const app = new Hono();
app.use(cors());
try {
    await initializeDatabase();
}
catch (err) {
    console.log(err);
    console.log("Database failed to get connection");
    process.exit(1);
}
app.route("/providers", providers);
app.route("/agents", agents);
app.onError((err, c) => {
    if (err instanceof CustomError) {
        console.log(err.message);
        const ReturnJson = {
            data: null,
            errorCode: err.errorCode,
            message: err.message,
            statusCode: err.statusCode,
            success: false,
        };
        return c.json(ReturnJson, ReturnJson.statusCode);
    }
    return c.json(err);
});
serve({
    fetch: app.fetch,
    port: 3000,
}, info => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
export { AppDataSource };
