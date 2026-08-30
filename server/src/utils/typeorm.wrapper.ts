import { QueryFailedError } from "typeorm";
import {
  BadRequestError,
  ConflictError,
  InternalError,
} from "./custom.httpexception.js";

export async function TypeOrmHandle(action: () => Promise<void>) {
  try {
    await action();
  } catch (err) {
    if (err instanceof QueryFailedError) {
      const code = (err.driverError as any).code;

      // SQLite constraint error codes
      if (code === "SQLITE_CONSTRAINT_FOREIGNKEY" || code === "787") {
        BadRequestError("Referenced entity does not exist");
      }
      if (code === "SQLITE_CONSTRAINT_UNIQUE" || code === "2067") {
        ConflictError("Data already exists");
      }
    }

    console.error("TypeORM Error:", err);
    InternalError("Database operation failed");
  }
}
