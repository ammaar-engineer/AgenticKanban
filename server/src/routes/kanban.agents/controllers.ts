import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { KanbanAgent } from "../../entities/kanban-agent.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const kanbanAgents = new Hono();
const kanbanAgentRepo = AppDataSource.getRepository(KanbanAgent);

kanbanAgents.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string().min(1, "Name is required"),
      layers_id: z.string().uuid("Valid layer ID is required"),
      agents_id: z.string().uuid("Valid agent ID is required"),
      board_id: z.string().uuid("Valid board ID is required"),
    }),
  ),
  async c => {
    const { name, layers_id, agents_id, board_id } = c.req.valid("form");
    await TypeOrmHandle(async () => {
      await kanbanAgentRepo.save(
        kanbanAgentRepo.create({
          name,
          layersId: layers_id,
          agentsId: agents_id,
          boardId: board_id,
        }),
      );
    });
    console.log("Kanban agent has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban agent has been created",
      }),
    );
  },
);

kanbanAgents.delete("/delete/:agentId", async c => {
  await TypeOrmHandle(async () => {
    await kanbanAgentRepo.delete({ id: c.req.param("agentId") });
  });
  return c.json(
    StandardJsonResponse({
      message: "Kanban agent has been deleted",
    }),
    200,
  );
});
