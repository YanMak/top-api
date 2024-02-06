import { Controller, Get, Header } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { ConfigService } from '@nestjs/config';
import { LoymaxService } from './loymax/loymax-balance.service';

@Controller('loyalty')
export class LoyaltyController {
  domain: string;

  constructor(
    private readonly loyaltyService: LoyaltyService,
    private readonly configService: ConfigService,
    private readonly loymaxService: LoymaxService,
  ) {
    this.domain = this.configService.get('DOMAIN') ?? '';
  }

  @Get('balance')
  @Header('content-type', 'text/xml')
  async getBalance() {
    return this.loyaltyService.getBalance('79269167763');
  }
}
