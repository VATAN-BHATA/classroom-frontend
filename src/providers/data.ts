import { createDataProvider, CreateDataProviderOptions } from '@refinedev/rest';
import { BACKEND_BASE_URL } from '@/constants';
import { ListResponse } from '@/types';

if (!BACKEND_BASE_URL) throw new Error ('BACKEND_BASE_URL is not configured. Please set VITE_BACKEND_BASE_URL in your .env file. ');

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,
    buildQueryParams: async ({ filters, pagination }) => {
      const query: Record<string, string | number> = {
        page: pagination?.currentPage ?? 1,
        limit: pagination?.pageSize ?? 10,
      };

      for (const filter of filters ?? []) {
        if (!('field' in filter) || typeof filter.value !== 'string') {
          continue;
        }

        if (filter.field === 'name' || filter.field === 'code') {
          query.search = filter.value;
        } else if (filter.field === 'department.name') {
          query.department = filter.value;
        }
      }

      return query;
    },
    mapResponse: async (response) => {
      const payload: ListResponse = await response.clone().json();
      return payload.data ?? [];
    },
    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export {dataProvider};