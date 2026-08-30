import { Hono } from "hono";
import { object, string } from "superstruct";
import { KanbanLayer } from "../../entities/kanban-layer.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { structValidator, UUID } from "../../utils/struct-validator.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const kanbanLayers = new Hono();
const layerRepo = AppDataSource.getRepository(KanbanLayer);

kanbanLayers.post(
  "/create",
  structValidator(
    object({
      name: string(),
      board_id: UUID,
    }),
  ),
  async c => {
    const { name, board_id } = c.req.valid("form");
    await TypeOrmHandle(async () => {
      await layerRepo.save(layerRepo.create({ name, boardId: board_id }));
    });
    console.log("Kanban layer has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban layer has been created",
      }),
    );
  },
);
