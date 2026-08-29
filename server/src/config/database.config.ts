import "reflect-metadata";
import { DataSource } from "typeorm";
import { Agent, Provider, KanbanBoard, KanbanLayer, KanbanAgent } from "../entities/index.js";

const dbPath = process.env.DB_FILE_NAME?.replace("file:", "") || "racersr.db";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: dbPath,
  entities: [Provider, Agent, KanbanBoard, KanbanLayer, KanbanAgent],
  synchronize: true,
  logging: false,
});

export const initializeDatabase = async () => {
  await AppDataSource.initialize();
  await AppDataSource.query("PRAGMA foreign_keys = ON");
};
