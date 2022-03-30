import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { OperationalErrorFilter } from "../common/filters/operational-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.useGlobalFilters(new OperationalErrorFilter());

  await app.listen(3000);
}
bootstrap();
