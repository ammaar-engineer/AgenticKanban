import { Hono } from "hono";
import { object, string } from "superstruct";
import { KanbanAgent } from "../../entities/kanban-agent.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { structValidator, UUID } from "../../utils/struct-validator.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const kanbanAgents = new Hono();
const kanbanAgentRepo = AppDataSource.getRepository(KanbanAgent);

kanbanAgents.post(
  "/create",
  structValidator(
    object({
      name: string(),
      layers_id: UUID,
      agents_id: UUID,
      board_id: UUID,
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
