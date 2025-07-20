import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger Configuration
const options = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My API Documentation",
      version: "1.0.0",
      description: "This is a sample Express API with Swagger",
    },
    servers: [
      {
        url: "http://localhost:8050",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };
