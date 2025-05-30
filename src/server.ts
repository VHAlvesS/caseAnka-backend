import fastifyCors from "@fastify/cors";
import { app } from "./app";

app.register(fastifyCors, {
  origin: true,
});

app.listen({ port: 3000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server is running at ${address}`);
});
