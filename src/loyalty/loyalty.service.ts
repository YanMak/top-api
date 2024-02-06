import { Injectable } from '@nestjs/common';
import { Builder, Parser } from 'xml2js';
import { LoymaxService } from './loymax/loymax-balance.service';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

@Injectable()
export class LoyaltyService {
  constructor(private readonly loymaxService: LoymaxService) {}
  async getBalance(customerId: string) {
    //  				ЗаписьХМЛ.ЗаписатьАтрибут("OperationID", СтрЗаменить(Строка(Новый УникальныйИдентификатор()), "-", ""));
    //			ЗаписьХМЛ.ЗаписатьАтрибут("OperationDate", Формат(ТекущаяДата(), "ДФ=yyyy-MM-ddTHH:mm:ss") + "+03:00");
    const operationID = uuidv4().replaceAll('-', '');
    const formatString = "yyyy-MM-dd'T'HH:mm:00.000xxx"; //'2023-02-15T15:17:12+03:00'
    const lastmod = format(new Date(), formatString);

    const requestPayload = await this.loymaxService.getBalanceRequestXML(
      '3.2',
      operationID,
      lastmod,
      'inc0101',
      '79269167763',
    );
    const data = await this.loymaxService.sendBalanceQuery(requestPayload);
    const parsed = await this.loymaxService.parseBalanceResponceXML(data);
    console.log(parsed);
  }
}
