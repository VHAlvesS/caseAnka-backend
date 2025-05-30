import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

type AllocationResponse = {
  id: number;
  asset: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  clientId: number;
};

export async function allocationRoutes(app: FastifyInstance) {
  app.get(
    "/clients/:id/allocations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });

      const querySchema = z.object({
        page: z.coerce.number().default(1),
        perPage: z.coerce.number().default(10),
      });

      const { id } = paramsSchema.parse(request.params);
      const { page, perPage } = querySchema.parse(request.query);

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client) {
        return reply.status(404).send({ message: "Client not found." });
      }

      const allocations = await prisma.allocation.findMany({
        where: {
          clientId: id,
        },
        include: {
          asset: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      });

      const total = await prisma.allocation.count({
        where: {
          clientId: id,
        },
      });

      return {
        data: allocations.map((allocation: AllocationResponse) => ({
          id: allocation.id,
          asset: {
            id: allocation.asset.id,
            name: allocation.asset.name,
            price: allocation.asset.price,
          },
          quantity: allocation.quantity,
          clientId: allocation.clientId,
        })),
        meta: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage),
        },
      };
    }
  );

  app.post(
    "/clients/:id/allocations",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.coerce.number(),
      });

      const bodySchema = z.object({
        assetId: z.number(),
        quantity: z.number().int().positive(),
      });

      const { id } = paramsSchema.parse(request.params);
      const { assetId, quantity } = bodySchema.parse(request.body);

      const allocationExists = await prisma.allocation.findUnique({
        where: {
          clientId_assetId: {
            clientId: id,
            assetId: assetId,
          },
        },
      });

      if (allocationExists) {
        return reply.status(409).send({
          message: "Allocation already exists.",
        });
      }

      const allocation = await prisma.allocation.create({
        data: {
          clientId: id,
          assetId,
          quantity,
        },
      });

      return reply.status(201).send(allocation);
    }
  );

  app.put(
    "/clients/:id/allocations/:assetId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        id: z.coerce.number(),
        assetId: z.coerce.number(),
      });

      const bodySchema = z.object({
        quantity: z.number().int().positive(),
      });

      const { id, assetId } = paramsSchema.parse(request.params);
      const { quantity } = bodySchema.parse(request.body);

      const allocation = await prisma.allocation.findUnique({
        where: {
          clientId_assetId: { clientId: id, assetId },
        },
      });

      if (!allocation) {
        return reply.status(404).send({ message: "Allocation not found." });
      }

      const updatedAllocation = await prisma.allocation.update({
        where: {
          clientId_assetId: { clientId: id, assetId },
        },
        data: { quantity },
      });

      return reply.status(200).send(updatedAllocation);
    }
  );

  app.delete(
    "/clients/:clientId/allocations/:assetId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const paramsSchema = z.object({
        clientId: z.coerce.number(),
        assetId: z.coerce.number(),
      });

      const { clientId, assetId } = paramsSchema.parse(request.params);

      await prisma.allocation.delete({
        where: {
          clientId_assetId: {
            clientId,
            assetId,
          },
        },
      });

      return reply.status(204).send();
    }
  );
}
