import { Module } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { ConfigModule } from '@nestjs/config';
import { LoymaxService } from './loymax/loymax-balance.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [LoyaltyService, LoymaxService],
  controllers: [LoyaltyController],
})
export class LoyaltyModule {}
