import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('message')
  async postMessage(@Body() body: IPostMessageBody): Promise<IPostResponce> {
    const ok = await this.appService.postMessage(body);

    return {
      ok,
      message: ok ? 'Succesfuly published' : 'Error',
    };
  }
}
