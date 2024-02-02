import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TopPageSearchService from 'src/top-page/search/top-page-search.service';

@Controller('sitemap')
export class SitemapController {
  constructor(
    private readonly topPageService: TopPageSearchService,
    private readonly configService: ConfigService,
  ) {}
}
