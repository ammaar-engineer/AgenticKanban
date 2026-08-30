import { Hono } from "hono";
import { object, string } from "superstruct";
import { Provider } from "../../entities/provider.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";
import { structValidator } from "../../utils/struct-validator.js";
import { TypeOrmHandle } from "../../utils/typeorm.wrapper.js";

export const providers = new Hono();
const providerRepo = AppDataSource.getRepository(Provider);

providers.get("/list", async c => {
  let providerList: any[] = [];
  await TypeOrmHandle(async () => {
    providerList = await providerRepo.find({
      select: {
        name: true,
        url: true,
        id: true,
      },
      loadEagerRelations: false,
    });
  });
  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: providerList,
    }),
    200,
  );
});

providers.delete("/delete/:providerName", async c => {
  await TypeOrmHandle(async () => {
    await providerRepo.delete({ name: c.req.param("providerName") });
  });
  return c.json(
    StandardJsonResponse({
      message: "Data has been deleted",
    }),
    200,
  );
});

providers.post(
  "/create",
  structValidator(
    object({
      name: string(),
      url: string(),
      apiKey: string(),
    }),
  ),
  async c => {
    const { name, apiKey, url } = c.req.valid("form");
    await TypeOrmHandle(async () => {
      await providerRepo.save(providerRepo.create({ name, url, apiKey }));
    });
    console.log("Provider has been created");
    return c.json(
      StandardJsonResponse({
        message: "Provider has been created",
      }),
    );
  },
);
