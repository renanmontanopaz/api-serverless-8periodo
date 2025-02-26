import { NestFactory } from '@nestjs/core';

import { INestApplication } from '@nestjs/common';
import serverlessExpress from 'serverless-http';
import { Express } from 'express';
import { Context } from 'aws-lambda';
import {AppModule} from "./src/app.module";

let cachedServer: serverlessExpress.Handler;

async function bootstrapServer(): Promise<serverlessExpress.Handler> {
    if (!cachedServer) {
        const nestApp: INestApplication = await NestFactory.create(AppModule);
        await nestApp.init();
        const expressApp = nestApp.getHttpAdapter().getInstance() as Express;
        cachedServer = serverlessExpress(expressApp);
    }
    return cachedServer;
}

export async function handler(event: any, context: Context) {
    const server = await bootstrapServer();
    return server(event, context);
}