import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { KanbanBoard } from "../../entities/kanban-board.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const kanbanBoards = new Hono();
const boardRepo = AppDataSource.getRepository(KanbanBoard);

kanbanBoards.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
    }),
  ),
  async (c) => {
    const { name, description } = c.req.valid("form");
    try {
      await boardRepo.save(boardRepo.create({ name, description }));
    } catch {
      console.log("Error creating kanban board");
    }
    console.log("Kanban board has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban board has been created",
      }),
    );
  },
);

kanbanBoards.get("/list", async (c) => {
  const boardList = await boardRepo.find({
    select: {
      id: true,
      name: true,
      description: true,
    },
    loadEagerRelations: false,
  });
  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: boardList,
    }),
    200,
  );
});

kanbanBoards.get("/detail", async (c) => {
  const boardId = c.req.query("boardId");
  if (!boardId) {
    return c.json(
      StandardJsonResponse({
        message: "boardId query parameter is required",
      }),
      400,
    );
  }

  console.log("Board masuk");

  const board = await boardRepo
    .createQueryBuilder("board")
    .leftJoinAndSelect("board.layers", "layer")
    .leftJoinAndSelect("layer.kanbanAgents", "kanbanAgent")
    .leftJoinAndSelect("kanbanAgent.agent", "agent")
    .leftJoinAndSelect("agent.provider", "provider")
    .where("board.id = :boardId", { boardId })
    .getOne();

  console.log(board);
  console.log("Board keluar");

  if (!board) {
    return c.json(
      StandardJsonResponse({
        message: "Board not found",
      }),
      404,
    );
  }

  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: board,
    }),
    200,
  );
});

kanbanBoards.delete("/delete/:boardId", async (c) => {
  await boardRepo.delete({ id: c.req.param("boardId") });
  return c.json(
    StandardJsonResponse({
      message: "Kanban board has been deleted",
    }),
    200,
  );
});
