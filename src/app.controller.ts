import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    await this.appService.handleCron()
    return this.appService.getHello();
  }

  @Get('/cron-job')
  async getNews(@Res() res: any): Promise<any> {
    const response = await this.appService.getNews();
    await this.appService.sendMail(response);
    return res.status(200).json({
      message: 'success',
      response
    });
  }

}
