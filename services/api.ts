import axios from 'axios';

export const quranApi = axios.create({
  baseURL: 'https://equran.id/api/v2',
  timeout: 10000,
});

export const prayerApi = axios.create({
  baseURL: 'https://api.aladhan.com/v1',
  timeout: 10000,
});

export const doaApi = axios.create({
  baseURL: 'https://equran.id/api',
  timeout: 10000,
});
