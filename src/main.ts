const cookieSession = require("cookie-session"); //Because nestJS dont support es-version for this module.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ["ola123"]
  }));
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true })
  );
  await app.listen(3000);
};
bootstrap();
