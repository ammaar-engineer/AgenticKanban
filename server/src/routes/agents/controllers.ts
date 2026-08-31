import { Hono } from "hono";
import { object, optional, string } from "superstruct";
import { Agent } from "../../entities/agent.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { structValidator, UUID } from "../../utils/struct-validator.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const agents = new Hono();
const agentRepo = AppDataSource.getRepository(Agent);

agents.post(
  "/create",
  structValidator(
    object({
      name: string(),
      model_id: string(),
      personality: optional(string()),
      description: optional(string()),
      provider_id: UUID,
    }),
  ),
  async c => {
    const { name, model_id, personality, description, provider_id } =
      c.req.valid("form");
    await TypeOrmHandle(async () => {
      await agentRepo.save(
        agentRepo.create({ name, model_id, personality, description, provider_id }),
      );
    });
    console.log("Agent has been created");
    return c.json(
      StandardJsonResponse({
        message: "Agent has been created",
      }),
    );
  },
);

agents.get("/list", async c => {
  let agentList: any[] = [];
  await TypeOrmHandle(async () => {
    agentList = await agentRepo.find({
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
  await TypeOrmHandle(async () => {
    await agentRepo.delete({ id: c.req.param("agentId") });
  });
  return c.json(
    StandardJsonResponse({
      message: "Data has been deleted",
    }),
    200,
  );
});
