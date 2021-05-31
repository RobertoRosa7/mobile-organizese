/* eslint-disable @typescript-eslint/naming-convention */
import { createReducer, on } from '@ngrx/store';
import * as moment from 'moment';
import * as actionsApp from '../actions/app.actions';
import * as actions from '../actions/dashboard.actions';
import * as utils from './utils.reducer';

const BASE = {
  consolidado: {
    total_credit: 0,
    total_debit: 0,
    total_consolidado: 0,
    percent_consolidado: 0,
    percent_debit: 0,
    percent_credit: 0,
    a_pagar: 0,
    a_receber: 0,
  },
  registers: [],
  dark_mode: '',
  mode: '',
  evolucao: {},
  evolucao_detail: {},
  evolucao_despesas: {},
  auto_complete: [],
  graph_category: [],
  outcome_income: {},
  lastdate_outcome: {},
  graph_dates: {
    dt_start: moment().subtract(31, 'days'),
    dt_end: moment(new Date()),
  },
};

const INITIAL_STATES = BASE;

const dashboardReducers = createReducer(
  INITIAL_STATES,
  on(actions.SET_LASTDATE_OUTCOME, (states, { payload }) => ({
    ...states,
    lastdate_outcome: payload,
  })),
  on(actions.GET_TOTALS, (states, { payload }) => ({
    ...states,
    consolidado: payload,
  })),
  on(actions.DARK_MODE, (states, { payload }) => ({
    ...states,
    dark_mode: payload,
  })),
  on(actions.SET_EVOLUCAO, (states, { payload }) => ({
    ...states,
    evolucao: payload,
  })),
  on(actions.SET_EVOLUCAO_DETAIL, (states, { payload }) => ({
    ...states,
    evolucao_detail: payload,
  })),
  on(actions.SET_DEV_MODE, (states, { payload }) => ({
    ...states,
    mode: payload.mode,
  })),
  on(actions.SET_EVOLUCAO_DESPESAS, (states, { payload }) => ({
    ...states,
    evolucao_despesas: payload,
  })),
  on(actions.SET_AUTOCOMPLETE, (states, { payload }) => ({
    ...states,
    auto_complete: payload,
  })),
  on(actions.FETCH_DATES, (states, { payload }) => ({
    ...states,
    graph_dates: payload,
  })),
  on(actions.SET_GRAPH_OUTCOME_INCOME, (states, { payload }) => ({
    ...states,
    outcome_income: utils.formatterOutcomeIncome(payload),
  })),
  on(actions.SET_DASHBOARD, (states, { payload }) => {
    const totals: any = utils.total(payload.data.results);
    return {
      ...states,
      registers:
        payload.data.results.length > 0
          ? utils.updateAll(payload.data.results)
          : [],
      // consolidado: payload.data.consolidado,
      // total: payload.data.total,
      // total_geral: payload.data.total_geral,
      // total_despesas: totals.despesa,
      // total_receita: totals.receita,
      // a_pagar: payload.data.consolidado.a_pagar,
      // a_receber: payload.data.consolidado.a_receber,
      // all_days_period: payload.data.days <= 0 ? 1 : payload.data.days,
    };
  }),
  on(actions.SET_GRAPH_CATEGORY, (states, { payload }) => {
    const payloadFormated: any = utils.formatDataToGraphCategory({
      ...payload,
    });
    return {
      ...states,
      graph_category: payloadFormated,
    };
  }),
  on(actionsApp.resetall, (states) => ({ ...states, BASE }))
);

export const reducerDashboard = (state: any, action: any): any =>
  dashboardReducers(state, action);