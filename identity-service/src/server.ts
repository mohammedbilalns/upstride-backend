import { configDotenv } from "dotenv";
import App from "./app";
import env from "./infrastructure/config/env";

configDotenv();
const PORT = env.PORT;
const server = new App();

server.listen(PORT);
