/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as actionsApp from '../../../actions/app.actions';
import * as actionsDashboard from '../../../actions/dashboard.actions';
import { DashboardPage } from '../dashboard.page';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit {
  public isLoaded = false;
  public error$: Observable<any>;
  public dashboard$: Observable<any>;
  public highchartData$: Observable<any>;
  public registersData$: Observable<any>;
  public consolidadoData$: Observable<any>;
  public minDate$: Observable<any>;
  public isContentLoaded: boolean;

  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: '',
      show: true,
      value: 0,
      type: 'consolidado',
      percent: 0,
    },
    {
      title: 'Crédito',
      icon: '',
      show: true,
      value: 0,
      type: 'incoming',
      percent: 0,
    },
    {
      title: 'Débito',
      icon: '',
      show: true,
      value: 0,
      type: 'outcoming',
      percent: 0,
    },
  ];
  constructor(protected store: Store) {
    super();
  }

  public ngOnInit() {
    this.initializingMain();
  }

  protected async initializingMain(): Promise<any> {
    await this.initHideValues();
    await this.initGraphOutcomeIncome();
    await this.initLastDateOutcomeIncome();
    await this.initDatesGraph();
    this.fetchStore();
  }

  protected fetchStore() {
    this.consolidadoData$ = this.store
      .select(({ dashboard, app }: any) => ({
        consolidado: this.cards.map((value: any) => {
          value.show = app.hidevalues;
          value.icon = app.hidevalues ? 'eye' : 'eye-off';
          switch (value.type) {
            case 'incoming':
              value.value = dashboard.consolidado.total_credit || 0;
              value.percent = dashboard.consolidado.percent_credit || 0;
              break;
            case 'outcoming':
              value.value = dashboard.consolidado.total_debit || 0;
              value.percent = dashboard.consolidado.percent_debit || 0;
              break;
            case 'consolidado':
              value.value = dashboard.consolidado.total_consolidado || 0;
              value.percent = dashboard.consolidado.percent_consolidado;
              break;
          }
          return value;
        }),
      }))
      .pipe(map((state) => state.consolidado));

    this.highchartData$ = this.store
      .select(({ dashboard }: any) => ({
        outcomeIncome: dashboard.outcome_income,
        dt_start: dashboard.graph_dates.dt_start,
        dt_end: dashboard.graph_dates.dt_end,
      }))
      .pipe(map((state) => state));

    this.registersData$ = this.store.select(({ dashboard, profile }: any) => ({
      all: dashboard.registers,
      profile: profile.profile,
    }));

    this.minDate$ = this.store
      .select(({ dashboard }: any) => ({
        lastDate: dashboard.lastdate_outcome,
      }))
      .pipe(map((state) => new Date(state.lastDate.dt_start)));
  }

  protected initHideValues(): Promise<any> {
    return Promise.resolve(this.store.dispatch(actionsApp.GET_HIDE_VALUES()));
  }

  protected initGraphOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.FETCH_GRAPH_OUTCOME_INCOME())
    );
  }

  protected initLastDateOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.FETCH_LASTDATE_OUTCOME())
    );
  }

  protected initDatesGraph(): Promise<any> {
    return Promise.resolve(this.store.dispatch(actionsDashboard.FETCH_DATES()));
  }
}
