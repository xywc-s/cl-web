import request from './request';

export const getStatics = () => request.get('/static');

export const allViews = (params) => request.get('', { params: params });

export const keywordDetail = (key) => request.get(`/keyword/${key}`);

export const getAllJobs = () => request.get('/job');
export const createJob = (params) => request.post('/job', params);
export const updateJob = (params) => request.put('/job', params);
export const deleteJob = (params) => request.delete('/job', { params: params });


