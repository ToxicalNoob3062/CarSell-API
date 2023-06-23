import { Controller, Get, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Redirect('https://documenter.getpostman.com/view/21925117/2s93z6ciaH')
  getDocumentation() { }
}
