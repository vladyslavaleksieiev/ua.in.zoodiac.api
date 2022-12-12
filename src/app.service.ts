import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private getMessageBody(messageInfo: IPostMessageBody): string {
    const result = [
      '<b>Новая заявка на сайте!</b>',
      `<i>Имя:</i> ${messageInfo.name}`,
      `<i>Телефон:</i> ${messageInfo.phone}`,
    ];

    if (messageInfo.message) {
      result.push('\n<i>Сообщение:</i>', messageInfo.message);
    }
    if (messageInfo.basket?.length > 0) {
      result.push(
        '\n<i>Товары что заинтересовали:</i>',
        ...messageInfo.basket.map((item) => `• ${item}`),
      );
    }

    return encodeURIComponent(result.join('\n'));
  }

  async postMessage(messageInfo: IPostMessageBody): Promise<boolean> {
    const body = this.getMessageBody(messageInfo);

    const token = this.configService.get<string>('TELEGRAM_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    try {
      await firstValueFrom(
        this.httpService
          .get(
            `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=html&text=${body}`,
          )
          .pipe(
            catchError((error) => {
              console.log(error);
              throw 'Error';
            }),
          ),
      );
      return true;
    } catch {
      return false;
    }
  }
}
