/* eslint-disable @typescript-eslint/naming-convention */
import { Register } from '../interfaces/general';

export const updateAll = (all: any): any =>
  all.map((s: Register) => ({
    ...s,
    status: statusTrans(s.status, s.type),
    cat_icon: returnIcon(s.category),
  }));

export const total = (lista: any): any => {
  const totals: any = { despesa: 0, receita: 0 };

  lista.forEach((v: any) => {
    if (v.type === 'outcoming') {
      totals.despesa += v.value;
    } else if (v.type === 'incoming') {
      totals.receita += v.value;
    }
  });
  return totals;
};

export const returnIcon = (text: string = ''): string => {
  switch (cleanText(text)) {
    case 'alimentacao':
      return 'restaurant';
    case 'transporte':
      return 'train';
    case 'banco':
      return 'account_balance';
    case 'trabalho':
      return 'work_outline';
    case 'vestuario':
      return 'checkroom';
    case 'outros':
      return 'drag_indicator';
    case 'pessoal':
      return 'perm_identity';
    case 'internet':
      return 'swap_vert';
    case 'agua_e_luz':
      return 'payment';
    default:
      return 'drag_indicator';
  }
};

export const statusTrans = (text: string = '', type: string): string => {
  switch (text) {
    case 'pending':
    case 'pendente a pagar':
    case 'pendente a receber':
      return type === 'incoming' ? 'pendente a receber' : 'pendente a pagar';
    case 'done':
    case 'concluído':
      return 'concluído';
    default:
      return 'pendente';
  }
};

export const cleanText = (text: string | undefined = ''): string =>
  text
    .toLowerCase()
    .replace(' ', '_')
    .replace('&', 'e')
    .replace('á', 'a')
    .replace('ã', 'a')
    .replace('ç', 'c')
    .replace('õ', 'o');

export const formatDataToGraphCategory = (payload: any): any =>
  Object.values(payload.category)
    .map((v: any) => ({ name: v, sliced: true }))
    .map((v: any, index) => ({
      ...v,
      total: abstract(payload.total, index),
    }))
    .map((val: any, index) => ({
      ...val,
      name: val.name,
      y: abstract(payload.each_percent, index),
    }));

const abstract = (payload: any, index: number): any =>
  Object.values(payload).map((v: any) => ({ v }))[index].v;

export const formatterOutcomeIncome = (payload: any): any =>
  payload.outcome_income.map((value: any) => ({
    ...value,
    name: value.name === 'incoming' ? 'Entrada' : 'Saída',
    dates: value.dates.map((date: any) => new Date(date).getTime()),
    data: value.values,
    color: value.name === 'incoming' ? '#0FF5E6' : '#FF4081',
  }));
