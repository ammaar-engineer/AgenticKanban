import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { KanbanLayer } from "../../entities/kanban-layer.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const kanbanLayers = new Hono();
const layerRepo = AppDataSource.getRepository(KanbanLayer);

kanbanLayers.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string().min(1, "Name is required"),
      board_id: z.string().uuid("Valid board ID is required"),
    }),
  ),
  async c => {
    const { name, board_id } = c.req.valid("form");
    try {
      await layerRepo.save(layerRepo.create({ name, boardId: board_id }));
    } catch {
      console.log("Error creating kanban layer");
    }
    console.log("Kanban layer has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban layer has been created",
      }),
    );
  },
);
