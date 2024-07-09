import cors from "cors";
import express from "express";
import setupRoutes from "./setup/setupRoutes";
import setupMiddlewares from "./setup/setupMiddlewares";
import useragent from "express-useragent";

const app = express();
app.use(express.json());
app.use(cors());

app.use(useragent.express());

setupMiddlewares(app);
setupRoutes(app);

export default app;
