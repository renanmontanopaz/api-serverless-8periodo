import { INestApplicationContext } from '@nestjs/common';
import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AppService } from './src/app.service';

let app: INestApplicationContext;

export const handler: Handler = async (event) => {
  try {
    if (!app) {
      app = await NestFactory.createApplicationContext(AppModule);
    }

    const appService = app.get(AppService);
    return {
      statusCode: 200,
      body: JSON.stringify(appService.getHello()),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error',
      }),
    };
  }
};
