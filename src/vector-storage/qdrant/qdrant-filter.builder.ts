import { Injectable } from '@nestjs/common';
import { SearchFilterOr } from './types/filters/search-filter-or';
import { SearchFilterMatcher } from './types/filters/search-filter-matcher';
import { SearchFilterParameter } from './types/filters/search-filter-parameter';
import { SearchFilterAnd } from './types/filters/search-filter-and';

@Injectable()
export class QdrantFilterBuilder {
  buildSearchFilter(
    insuranceType: string,
    onlyPublicDocs: boolean,
  ): SearchFilterAnd {
    const filterAnd: SearchFilterAnd = new SearchFilterAnd();

    if (onlyPublicDocs) {
      const publicMatcher: SearchFilterMatcher = new SearchFilterMatcher();
      publicMatcher.value = true;

      const publicParameter: SearchFilterParameter =
        new SearchFilterParameter();
      publicParameter.key = 'metadata.publicAccess';
      publicParameter.match = publicMatcher;

      filterAnd.must.push(publicParameter);
    }

    if (insuranceType === 'both') {
      return filterAnd;
    }

    const matcher1: SearchFilterMatcher = new SearchFilterMatcher();
    matcher1.value = insuranceType;
    const matcher2: SearchFilterMatcher = new SearchFilterMatcher();
    matcher2.value = 'both';

    const parameter1: SearchFilterParameter = new SearchFilterParameter();
    parameter1.match = matcher1;
    const parameter2: SearchFilterParameter = new SearchFilterParameter();
    parameter2.match = matcher2;

    const filterOr: SearchFilterOr = new SearchFilterOr();
    filterOr.should = [parameter1, parameter2];

    filterAnd.must.push(filterOr);

    return filterAnd;
  }

  buildScrollFilter(documentId: string): SearchFilterOr {
    const matcher: SearchFilterMatcher = new SearchFilterMatcher();
    matcher.value = documentId;

    const parameter: SearchFilterParameter = new SearchFilterParameter();
    parameter.key = 'metadata.documentId';
    parameter.match = matcher;

    const filter: SearchFilterOr = new SearchFilterOr();
    filter.should = [parameter];

    return filter;
  }
}
