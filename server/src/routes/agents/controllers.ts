import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { Agent } from "../../entities/agent.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const agents = new Hono();
const agentRepo = AppDataSource.getRepository(Agent);

agents.get("/list", async c => {
  const agentList = await agentRepo.find();
  return c.json(StandardJsonResponse({ message: "Success", data: agentList }), 200);
});

agents.get("/get/:modelId", async c => {
  const agent = await agentRepo.findOne({
    where: { model_id: c.req.param("modelId") },
    loadEagerRelations: false,
  });
  return c.json(StandardJsonResponse({ data: agent, message: "Success" }), 200);
});

agents.delete("/delete/:modelId", async c => {
  await agentRepo.delete({ model_id: c.req.param("modelId") });
  return c.json(StandardJsonResponse({ message: "Data has been deleted" }), 200);
});

agents.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string(),
      model_id: z.string(),
      personality: z.string().optional(),
      description: z.string().optional(),
      provider_id: z.number(),
    }),
  ),
  async c => {
    const data = c.req.valid("form");
    await agentRepo.save(agentRepo.create(data));
    return c.json(StandardJsonResponse({ message: "Agent has been created" }));
  },
);
