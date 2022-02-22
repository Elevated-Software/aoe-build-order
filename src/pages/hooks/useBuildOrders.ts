import useSWR from 'swr';
import { Tag } from '../../lib/consts';
import { BoListItem } from '../../lib/models/api';

export function useBuildOrders(page: number, tags: Tag[], civ: string) {
  const { data, error } = useSWR<{ success: boolean, pagesCount: number, page: number, size: number, buildOrders: BoListItem[]; }>(`/api/build-orders?page=${page}&tags=${tags?.join(',')}&civ=${civ}`, { dedupingInterval: 5000 });

  return {
    data,
    loading: !error && !data,
    error,
  };
}
