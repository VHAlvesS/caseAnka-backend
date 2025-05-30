import Fastify from "fastify";
import { clientRoutes } from "./routes/client";
import { assetRoutes } from "./routes/asset";
import { z } from "zod";
import { allocationRoutes } from "./routes/allocation";

export const app = Fastify({ logger: true });

app.register(clientRoutes, { prefix: "/clients" });
app.register(assetRoutes, { prefix: "/assets" });
app.register(allocationRoutes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      errors: error.errors,
    });
  }

  return reply.status(500).send({
    message: error.message,
  });
});
