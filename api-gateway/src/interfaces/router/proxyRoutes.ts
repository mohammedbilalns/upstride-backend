import { Router } from "express";
import proxy from "express-http-proxy";
import env from "../../infra/config/env";
import { proxyOptions } from "../../infra/config/proxyOptions";
import logger from "../../utils/logger";
const router = Router();

router.use("/auth", proxy(env.IDENTITY_SERVICE_URL, {
  ...proxyOptions,
  proxyReqOptDecorator: (proxyReqOpts, _srcReq) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, _srcReq, _res) => {
    logger.info(`Response received from identity service: ${proxyRes.statusCode}`);
    return proxyResData;
  }
}));



export default router;
