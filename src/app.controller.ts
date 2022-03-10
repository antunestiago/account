import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {response} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async handleRequestEvent(@Res() res, @Body() eventMessage: string) {
    return await this.appService
      .handlerEvents(eventMessage)
      .then((response) => {
        res.status(201).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  }
}
