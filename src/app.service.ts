import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import path from 'path';
const NewsAPI = require('newsapi');


@Injectable()
export class AppService {

  constructor(private configService: ConfigService, private readonly mailService: MailerService) {

  }

  getHello(): string {
    return 'Hello World!';
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async getNews()  {
    const newsApiKey = new NewsAPI(this.configService.get('NEWS_API_KEY'));
    try {
      const res = await newsApiKey.v2.topHeadlines({
        q: 'trump',
        category: 'business',
        language: 'en',
        country: 'us',
      });
      
      return res;
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch news');
    }
  }

  async sendMail(news: any) {
    if (!news || !news.articles || news.articles.length === 0) return; // No articles to send

    try {
      if (news) {
        await this.mailService.sendMail({
          to: 'hotanphat.htp99@gmail.com',
          subject: `CronJob News`,
          template: './newsTemplate', 
          context: {
            articles: news.articles,
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send mail');
    }
  }

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron() {
    const news = await this.getNews();
    await this.sendMail(news);
  }

}
