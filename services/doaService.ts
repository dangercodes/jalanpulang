import { doaApi } from './api';

export interface DoaBase {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
}

export const getDoaList = async (): Promise<DoaBase[]> => {
  const { data } = await doaApi.get<{ code: number; message: string; data: DoaBase[] }>('/doa');
  return data.data;
};

export const getDoaDetail = async (id: number): Promise<DoaBase> => {
  const { data } = await doaApi.get<{ code: number; message: string; data: DoaBase }>(`/doa/${id}`);
  return data.data;
};
