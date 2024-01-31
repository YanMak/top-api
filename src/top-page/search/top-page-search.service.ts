import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { TopPageModel } from '../models/top-page.model';
import { TopPageSearchBody, TopPageSearchResult } from './interfaces.search';

@Injectable()
export default class TopPageSearchService {
  index = 'top-page';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexTopPage(topPage: TopPageModel & { _id: string }) {
    //return this.elasticsearchService.index<TopPageSearchResult, TopPageSearchBody>({
    return this.elasticsearchService.index<TopPageSearchBody>({
      index: this.index,
      body: {
        id: topPage._id,
        title: topPage.title,
        seoText: topPage.seoText,
      },
    });
  }

  async search(text: string) {
    const { hits } =
      await this.elasticsearchService.search<TopPageSearchResult>({
        index: this.index,
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'seoText'],
          },
        },
      });
    //const hits = body.hits.hits;
    //const hits_ = hits.hits;
    return hits.hits.map((item) => item._source);
  }

  /*
  async searchById(id: string) {
    const { hits } =
      await this.elasticsearchService.search<TopPageSearchResult>({
        index: this.index,
        query: {
          ids: ['65b932e30970fdf409459452'],
        },
      });
    //const hits = body.hits.hits;
    //const hits_ = hits.hits;
    return hits.hits.map((item) => item._source);
  }*/

  async remove(id: string) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id,
          },
        },
      },
    });
  }

  async update(topPage: TopPageModel & { _id: string }) {
    const newBody: TopPageSearchBody = {
      id: topPage._id,
      title: topPage.title,
      seoText: topPage.seoText,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');
    console.log('top page');
    console.log(topPage);
    console.log('script: {---------');
    console.log(script);
    console.log('script: }---------');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      query: {
        term: {
          id: topPage.id,
        },
      },
      script: script,
    });
    /*{
      index: this.index,
      body: {
        query: {
          match: {
            id: topPage.id,
          },
        },
        script: {
          inline: script,
        },
      },
    }*/
  }
}
