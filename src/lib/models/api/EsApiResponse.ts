import { NextApiResponse } from 'next';

interface EsResponse {
  success: boolean;
}

export interface EsApiResponse<T> extends NextApiResponse<T & EsResponse> { };
