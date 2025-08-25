import { configDotenv } from "dotenv";
import env from "./infrastructure/config/env";
import App from "./app";

configDotenv();
const PORT = env.PORT;
const server = new App();

server.listen(PORT);
