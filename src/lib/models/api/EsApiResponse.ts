import { NextApiResponse } from 'next';

interface EsResponse {
  success: boolean;
}

export interface EsApiResponse<T = any> extends NextApiResponse<T & EsResponse> { };
