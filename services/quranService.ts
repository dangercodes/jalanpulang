import { quranApi } from './api';

export interface SurahBase {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends SurahBase {
  ayat: Ayah[];
  suratSelanjutnya: SurahBase | false;
  suratSebelumnya: SurahBase | false;
}

export const getSurahList = async (): Promise<SurahBase[]> => {
  const { data } = await quranApi.get<{ code: number; message: string; data: SurahBase[] }>('/surat');
  return data.data;
};

export const getSurahDetail = async (nomor: number): Promise<SurahDetail> => {
  const { data } = await quranApi.get<{ code: number; message: string; data: SurahDetail }>(`/surat/${nomor}`);
  return data.data;
};
