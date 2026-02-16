import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { handle as polarWebhookHandler } from "./polar_webhooks";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

http.route({
  path: "/polar-webhooks",
  method: "POST",
  handler: polarWebhookHandler,
});

export default http;
