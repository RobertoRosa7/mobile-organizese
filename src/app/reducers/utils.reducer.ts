/* eslint-disable @typescript-eslint/naming-convention */
import * as moment from 'moment';
import { Register } from '../interfaces/general';

const groupByDay = (list: any) => list.map((i: any) => getIsoDay(i))
.reduce((prevYear, currentYear) => setGroup(prevYear, currentYear, 'year'), [])
.map(valueYear => ({
  ...valueYear,
  list: valueYear.list.reduce((prevMonth, currentMonth) => setGroup(prevMonth, currentMonth, 'month'), [])
    .map(valueMonth => ({
    ...valueMonth,
    list: valueMonth.list.reduce((prevDay, currentDay) => setGroup(prevDay, currentDay, 'day'), [])
    .map((valueDay) => setSumDailyValues(valueDay))
  }))
}));

const setGroup = (prev, current, mode ) => {
  let index = prev.findIndex((i) => moment(i[mode])[mode]() === moment(current.date)[mode]());
  if (index < 0) {
    index = prev.length;
    prev.push({ [mode]: new Date(current.date).getTime(), list: [] });
  }
  prev[index].list.push(current);
  return prev;
};

const setSumDailyValues = (values) => ({
  ...values,
  day: new Date(values.day).getTime(),
  total_credits: values.list.map((v: any) => (v.type === 'incoming' ? v.value : 0)).reduce((v, i) => v + i),
  total_debits: values.list.map((v: any) => (v.type === 'outcoming' ? v.value : 0)).reduce((v, i) => v + i),
});

const getIsoDay = (value) => ({ ...value, date: new Date(value.created_at * 1000) });

export const updateAll = (all: any) =>
  all.map((register: Register) => ({
    ...register,
    status: statusTrans(register.status, register.type),
    cat_icon: returnIcon(register.category),
  }));

export const returnRegisters = (registers) =>
  registers.length > 0 ? groupByDay(updateAll(registers)) : [];

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
    name:
      value.name === 'incoming'
        ? 'Entrada'
        : value.name === 'outcoming'
        ? 'Saída'
        : '',
    dates: value.dates.map((date: any) => new Date(date).getTime()),
    data: value.values ? value.values : 0,
    color:
      value.name === 'incoming' ? 'var(--green-microsoft)' : 'var(--danger)',
  }));
