import { SearchFilterOr } from './search-filter-or';
import { SearchFilterParameter } from './search-filter-parameter';

export class SearchFilterAnd {
  must: (SearchFilterOr | SearchFilterParameter)[] = [];
}
