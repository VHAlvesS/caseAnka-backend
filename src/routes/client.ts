import { FastifyInstance } from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function clientRoutes(app: FastifyInstance) {
  app.get("/", async (request: FastifyRequest) => {
    const querySchema = z.object({
      page: z.coerce.number().default(1),
      perPage: z.coerce.number().default(10),
    });

    const { page, perPage } = querySchema.parse(request.query);

    const clients = await prisma.client.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const total = await prisma.client.count();

    return {
      data: clients,
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  });

  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createClientBody = z.object({
      name: z.string(),
      email: z.string().email(),
      status: z.boolean(),
    });

    const { name, email, status } = createClientBody.parse(request.body);

    const client = await prisma.client.create({
      data: {
        name,
        email,
        status,
      },
    });

    return reply.status(201).send(client);
  });

  app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const updateParams = z.object({
      id: z.coerce.number(),
    });

    const updateBody = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      status: z.boolean().optional(),
    });

    const { id } = updateParams.parse(request.params);
    const data = updateBody.parse(request.body);

    const verifyClient = await prisma.client.findUnique({ where: { id } });
    if (!verifyClient) {
      return reply.status(404).send({ message: "Client not found." });
    }

    const client = await prisma.client.update({
      where: { id },
      data,
    });

    return reply.status(200).send(client);
  });

  app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const deleteParams = z.object({
      id: z.coerce.number(),
    });

    const { id } = deleteParams.parse(request.params);

    const verifyClient = await prisma.client.findUnique({ where: { id } });
    if (!verifyClient) {
      return reply.status(404).send({ message: "Client not found." });
    }

    const verifyAllocations = await prisma.allocation.findFirst({
      where: { clientId: id },
    });
    if (verifyAllocations) {
      await prisma.allocation.deleteMany({
        where: { clientId: id },
      });
    }

    await prisma.client.delete({
      where: { id },
    });

    return reply.status(204).send();
  });
}
