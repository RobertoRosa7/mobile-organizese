/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/registers.actions';
import * as actionsApp from '../actions/app.actions';
import * as utils from './utils.reducer';

const categories: string[] = [
  'Banco',
  'Alimentação',
  'Vestuário',
  'Transporte',
  'Contas',
  'Internet',
  'Pessoal',
  'Trabalho',
  'Outros',
].sort();

const tabList: string[] = [
  'read',
  'create',
  'print',
  'profile',
  'new_password',
  'theme',
  'about',
  'account',
];
const optionsFilterCategories: any[] = [
  {
    label: 'Entradas',
    type: 'incoming',
  },
  {
    label: 'Saídas',
    type: 'outcoming',
  },
  {
    label: 'Lançamentos',
    type: 'pending',
  },
  {
    label: 'Entrada/Saída',
    type: 'all',
  },
];

const INITIAL_STATE = {
  all: [],
  baseRegisters: [],
  tab: '',
  visible: {},
  consolidado: {},
  msg: '',
  total: 0,
  total_geral: 0,
  categories,
  total_despesas: 0,
  total_receita: 0,
  a_receber: 0,
  a_pagar: 0,
  all_days_period: 1,
  result_search: [],
  tabList,
  categoriesToOptions: categories.map((value: string) => ({ label: value, type: utils.cleanText(value)})).concat(optionsFilterCategories),
};
const registersReducers = createReducer(
  INITIAL_STATE,
  on(actions.SET_REGISTERS, (states, { payload }) => ({ ...states, baseRegisters: states.baseRegisters.concat(payload), })),
  on(actions.GET_REGISTERS, (states, { payload }) => {
    const totals: any = utils.total(payload.data.results);
    return {
      ...states,
      all: utils.returnRegisters(payload.data.results),
      baseRegisters: utils.updateAll(payload.data.results),
      consolidado: payload.data.consolidado,
      msg: payload.msg,
      total: payload.data.total,
      total_geral: payload.data.total_geral,
      total_despesas: totals.despesa,
      total_receita: totals.receita,
      a_pagar: payload.data.consolidado.a_pagar,
      a_receber: payload.data.consolidado.a_receber,
      all_days_period: payload.data.days <= 0 ? 1 : payload.data.days,
    };
  }),
  on(actions.GET_TAB, (states, { payload }) => ({ ...states, tab: payload })),
  on(actions.SET_SHOWTAB, (states, { payload }) => ({ ...states, visible: payload })),
  on(actions.SET_UPDATE, (states, { payload }) => {
    const stateUpdated: any = [...states.baseRegisters];
    stateUpdated[stateUpdated.findIndex((r) => r._id.$oid === payload._id.$oid)] = payload;
    return { ...states, all: utils.returnRegisters(stateUpdated) };
  }),
  on(actions.SET_SEARCH, (states, { payload }) => ({ ...states, result_search: utils.returnRegisters(payload) })),
  on(actionsApp.resetall, (states) => ({
    ...states,
    all: utils.returnRegisters([]),
    baseRegisters: [],
    tab: '',
    visible: {},
    consolidado: {},
    msg: '',
    total: 0,
    total_despesas: 0,
    categories,
    a_pagar: 0,
    a_receber: 0,
    all_days_period: 1,
    result_search: [],
  }))
);

export const reducer = (state: any, action: any) =>
  registersReducers(state, action);
