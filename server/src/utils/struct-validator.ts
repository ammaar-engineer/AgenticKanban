import { validator } from "hono/validator";
import { define, validate, type Struct } from "superstruct";
import { CustomError } from "./custom.httpexception.js";

/**
 * Reusable UUID struct (superstruct has no built-in UUID type).
 */
export const UUID = define<string>(
  "UUID",
  (value) =>
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    ),
);

/**
 * Collect all validation errors from a superstruct object schema.
 * validate() only returns the first error — this iterates each field.
 * Adds field name to each message since per-field validate loses the path.
 */
function collectErrors(value: unknown, schema: Struct): string[] {
  const errors: string[] = [];
  const props = (schema as any).schema;
  if (!props) return errors;

  for (const [key, fieldSchema] of Object.entries(props)) {
    const [err] = validate((value as any)[key], fieldSchema as Struct);
    if (err) {
      errors.push(`${key}: ${err.message}`);
    }
  }
  return errors;
}

/**
 * Hono form-validator backed by a superstruct schema.
 * Throws CustomError so app.onError handles the response.
 *
 * Usage:
 *   router.post('/create', structValidator(MySchema), handler)
 */
export function structValidator<T>(schema: Struct<T>) {
  return validator("form", (value) => {
    const [error, data] = validate(value, schema);
    if (error) {
      const messages = collectErrors(value, schema);
      const message =
        messages.length > 0 ? messages.join("; ") : error.message;

      throw new CustomError(
        false,
        message,
        "VALIDATION_ERROR",
        400,
        null,
      );
    }
    return data;
  });
}
