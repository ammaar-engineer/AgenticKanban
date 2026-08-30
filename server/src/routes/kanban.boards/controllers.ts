import { Hono } from "hono";
import { object, optional, string } from "superstruct";
import { KanbanBoard } from "../../entities/kanban-board.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { structValidator } from "../../utils/struct-validator.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const kanbanBoards = new Hono();
const boardRepo = AppDataSource.getRepository(KanbanBoard);

kanbanBoards.post(
  "/create",
  structValidator(
    object({
      name: string(),
      description: optional(string()),
    }),
  ),
  async c => {
    const { name, description } = c.req.valid("form");
    await TypeOrmHandle(async () => {
      await boardRepo.save(boardRepo.create({ name, description }));
    });
    console.log("Kanban board has been created");
    return c.json(
      StandardJsonResponse({
        message: "Kanban board has been created",
      }),
    );
  },
);

kanbanBoards.get("/list", async c => {
  let boardList: any[] = [];
  await TypeOrmHandle(async () => {
    boardList = await boardRepo.find({
      select: {
        id: true,
        name: true,
        description: true,
      },
      loadEagerRelations: false,
    });
  });
  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: boardList,
    }),
    200,
  );
});

kanbanBoards.get("/detail", async c => {
  const boardId = c.req.query("boardId");
  if (!boardId) {
    return c.json(
      StandardJsonResponse({
        message: "boardId query parameter is required",
      }),
      400,
    );
  }

  let board: any = null;
  await TypeOrmHandle(async () => {
    board = await boardRepo
      .createQueryBuilder("board")
      .leftJoinAndSelect("board.layers", "layer")
      .leftJoinAndSelect("layer.kanbanAgents", "kanbanAgent")
      .leftJoinAndSelect("kanbanAgent.agent", "agent")
      .leftJoinAndSelect("agent.provider", "provider")
      .where("board.id = :boardId", { boardId })
      .getOne();
  });

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

kanbanBoards.delete("/delete/:boardId", async c => {
  await TypeOrmHandle(async () => {
    await boardRepo.delete({ id: c.req.param("boardId") });
  });
  return c.json(
    StandardJsonResponse({
      message: "Kanban board has been deleted",
    }),
    200,
  );
});
