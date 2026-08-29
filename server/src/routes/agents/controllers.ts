import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { Agent } from "../../entities/agent.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const agents = new Hono();
const agentRepo = AppDataSource.getRepository(Agent);

agents.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string(),
      model_id: z.string(),
      personality: z.string().optional(),
      description: z.string().optional(),
      provider_id: z.coerce.number(),
    }),
  ),
  async c => {
    const { name, model_id, personality, description, provider_id } =
      c.req.valid("form");
    try {
      await agentRepo.save(
        agentRepo.create({ name, model_id, personality, description, provider_id }),
      );
    } catch {
      console.log("Error creating agent");
    }
    console.log("Agent has been created");
    return c.json(
      StandardJsonResponse({
        message: "Agent has been created",
      }),
    );
  },
);

agents.get("/list", async c => {
  const agentList = await agentRepo.find({
    select: {
      id: true,
      name: true,
      model_id: true,
      personality: true,
      description: true,
      provider: { name: true },
    },
    relations: { provider: true },
    loadEagerRelations: false,
  });
  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: agentList,
    }),
    200,
  );
});

agents.delete("/delete/:agentId", async c => {
  await agentRepo.delete({ id: Number(c.req.param("agentId")) });
  return c.json(
    StandardJsonResponse({
      message: "Data has been deleted",
    }),
    200,
  );
});
