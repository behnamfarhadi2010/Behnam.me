import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
<<<<<<< HEAD

=======
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

<<<<<<< HEAD

=======
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD

=======
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893

app.use("/api", router);

export default app;
