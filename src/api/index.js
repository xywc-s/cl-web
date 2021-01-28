import request from './request';

export const getStatics = () => request.get('/static');

export const allViews = (params) => request.get('', { params: params });

export const keywordDetail = (key) => request.get(`/keyword/${key}`);


