import "reflect-metadata";
import * as BodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { RegisterRoutes } from "../src-tsoa-autogen/routes";
import { initializeIoCContainer } from "./ioc";
import winston from "winston";

// localでは複数行のログが一行にまとめられてしまって見にくくなるので切る。

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.errors({ stack: true }),
    ),
    transports: [new winston.transports.Console()],
});
console.log = logger.info.bind(logger);
console.info = logger.info.bind(logger);
console.error = logger.error.bind(logger);
console.warn = logger.warn.bind(logger);
console.debug = logger.debug.bind(logger);

const initializeExpressApp = async () => {
    await initializeIoCContainer();
    const app = express();

    app.use(cors({ origin: "http://localhost:3000" }));
    // TODO: https通信だけ許可
    app.use(cors({ origin: /https?:\/\/\w*\.amecloud\.jp/ }));
    app.use(BodyParser.urlencoded({ extended: true }));
    app.use(BodyParser.json());
    RegisterRoutes(app);

    return app;
};

initializeExpressApp()
    .then((app) => {
        const PORT = 3333;
        app.listen(PORT, () => {
            console.info(`Server ready at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`サーバの起動に失敗しました: ${error}`);
        console.error(error.stack);
        process.exit(-1);
    });
