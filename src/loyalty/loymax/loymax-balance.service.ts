import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Builder, Parser } from 'xml2js';

@Injectable()
export class LoymaxService {
  user: string;
  password: string;
  url: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.user = 'inc0101';
    this.password = 'C645BCCB5A30D86DFB02F8B7CF9B8B21';
    this.url = configService.get('LOYMAX_CASHIER_API_URL');
  }

  async getBalanceRequestXML(
    Version: string,
    OperationID: string,
    OperationDate: string,
    DeviceLogicalID: string,
    customerId: string,
  ) {
    const builder = new Builder({
      xmldec: {
        version: '1.0',
        encoding: 'UTF-8',
      },
    });
    return builder.buildObject({
      XMLRequest: {
        $: {
          'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
          'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        },
        Version,
        Balances: {
          BalanceRequest: {
            $: {
              ElementID: '1',
              OperationID,
              OperationDate,
              DeviceLogicalID,
            },
            Identifier: {
              $: { Type: 'Auto', Value: customerId },
            },
          },
        },
      },
    });
  }

  async sendBalanceQuery(bodyXML: string) {
    console.log(bodyXML);
    const login = 'inc0101';

    this.httpService.axiosRef.defaults.headers['Authorization'] =
      'Basic aW5jMDEwMTpDNjQ1QkNDQjVBMzBEODZERkIwMkY4QjdDRjlCOEIyMQ==';
    this.httpService.axiosRef.defaults.headers['Content-Type'] =
      'application/xml';
    //config.auth.username = 'exch_user_warehouse';
    //config.auth.username = 'Exch_user_warehouse545';
    const apiUrl = this.configService.get('LOYMAX_CASHIER_API_URL');
    const connectUrl = apiUrl + login + '/';
    //const connectUrl2 =
    ('https://ext-incity.loytech.net:20443/XmlExchange/incity/inc0101/');
    console.log(connectUrl);
    //console.log(connectUrl2);
    const { data } = await this.httpService.axiosRef.post(connectUrl, bodyXML);
    //const { data } = await this.httpService.axiosRef.post(connectUrl2, bodyXML);
    console.log(data);
    console.log('_____________________');
    return data;
  }

  async parseBalanceResponceXML(bodyXML: string) {
    const parser = new Parser();
    /*parser.parseString(bodyXML, function (err, result) {
      //Extract the value from the data element
      extractedData = result['XMLResponse']['Balances'];
      console.log(JSON.stringify(extractedData));
    });*/

    const result = await parser.parseStringPromise(bodyXML);
    const balanceResponse =
      result['XMLResponse']['Balances'][0]['BalanceResponse'];

    //console.log(JSON.stringify(result.XMLResponse.Balances[0].BalanceResponse));
    const bonusAmount = parseInt(balanceResponse[0]['$']['BonusAmount']);
    const IdentifierData =
      result['XMLResponse']['Balances'][0]['BalanceResponse'][0][
        'IdentifierData'
      ];
    let customerName: string = '';
    let cardNumber: string = '';
    IdentifierData[0].Item.map((item) => {
      if (item['$'].Name === 'Person') {
        customerName = item['_'];
      }
      if (item['$'].Name === 'Cardnumber') {
        cardNumber = item['_'];
      }
    });
    //IdentifierData[0].Item.map((item) => console.log(item['_']));

    //console.log(IdentifierData[0]);
    //console.log(result.XMLResponse.Balances[0].BalanceResponse[0]['$']);

    return { bonusAmount, customerName, cardNumber };
  }
}
