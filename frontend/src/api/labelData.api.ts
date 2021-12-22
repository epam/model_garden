import { getRequest, CORS_PROXY_URL } from './api.service';

export const getLabelData = (url: string) => getRequest<any>(CORS_PROXY_URL + url);
