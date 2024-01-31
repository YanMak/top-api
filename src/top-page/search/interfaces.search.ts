export interface TopPageSearchBody {
  id: string;
  title: string;
  seoText: string;
}

export interface TopPageSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: TopPageSearchBody;
    }>;
  };
}
