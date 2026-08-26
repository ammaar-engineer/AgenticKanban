import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { Provider } from "../../entities/provider.entity.js";
import { AppDataSource } from "../../index.js";
import { StandardJsonResponse } from "../../utils/response.wrapper.js";

export const providers = new Hono();
const providerRepo = AppDataSource.getRepository(Provider);

providers.get("/list", async c => {
  const providerList = await providerRepo.find({
    select: {
      name: true,
      url: true,
      id: true,
    },
    loadEagerRelations: false
  });
  // InternalError("Internal service error");
  console.log(providerList)
  return c.json(
    StandardJsonResponse({
      message: "Success",
      data: providerList,
    }),
    200,
  );
});

providers.get("/get/:providerName", async c => {
  const providerTarget = await providerRepo.findOne({
    where: {
      name: c.req.param("providerName"),
    },
    loadEagerRelations: false,
  });
  return c.json(
    StandardJsonResponse({
      data: providerTarget,
      message: "Success",
    }),
    200,
  );
});

providers.delete("/delete/:providerName", async c => {
  await providerRepo.delete({ name: c.req.param("providerName") });
  return c.json(
    StandardJsonResponse({
      message: "Data has been deleted",
    }),
    200,
  );
});

providers.post(
  "/create",
  zValidator(
    "form",
    z.object({
      name: z.string(),
      url: z.string(),
      apiKey: z.string(),
    }),
  ),
  async c => {
    const { name, apiKey, url } = c.req.valid("form");
    try {
      await providerRepo.save(providerRepo.create({ name, url, apiKey }));
    } catch {
      console.log("ERror")
    }
    console.log("Provider has been created")
    return c.json(
      StandardJsonResponse({
        message: "Provider has been created",
      }),
    );
  },
);
