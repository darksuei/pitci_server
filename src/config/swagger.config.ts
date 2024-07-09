import { Application, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import logger from "./logger.config";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    tags: [
      {
        name: "health",
        description: "Health check",
      },
      {
        name: "auth",
        description: "Endpoints for user authentication",
      },
      {
        name: "user",
        description: "Endpoints for user information",
      },
      {
        name: "pitch",
        description: "Endpoints for pitches",
      },
      {
        name: "admin",
        description: "Endpoints for admin operations",
      },
    ],
    info: {
      title: "PITCI Documentation",
      version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Application, baseUrl: string) {
  // Swagger page
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/api/v1/docs.json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Documentation available at ${baseUrl}/api/v1/docs`);
}

export default swaggerDocs;
