/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import * as actionsApp from '../../../actions/app.actions';
import * as actionsDashboard from '../../../actions/dashboard.actions';
import { DashboardPage } from '../dashboard.page';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit, OnDestroy {
  public isLoaded = false;
  public error$: Observable<any>;
  public dashboard$: Observable<any>;
  public registersData$: Observable<any>;
  public highchCharts$: Observable<any>;
  public isContentLoaded: boolean;
  public teste = new BehaviorSubject(null);

  private subscription: Subscription = new Subscription();

  constructor(
    protected store: Store,
    protected subjectService: SubjectService
  ) {
    super();
  }

  ngOnInit() {
    this.initializingMain();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  protected async initializingMain(): Promise<any> {
    await this.initHideValues();
    await this.initGraphOutcomeIncome();
    await this.initLastDateOutcomeIncome();
    await this.initDatesGraph();
    await this.initMain();
    await this.initDashboard();
    this.fetchStore();
  }

  protected fetchStore() {
    this.subscription = this.store
      .select(({ dashboard, profile }: any) => ({
        all: dashboard.registers,
        profile: profile.profile,
      }))
      .subscribe((state) => this.teste.next(state));

    this.highchCharts$ = this.store.select(({ dashboard }: any) => ({
      outcomeIncome: dashboard.outcome_income,
      dt_start: dashboard.graph_dates.dt_start,
      dt_end: dashboard.graph_dates.dt_end,
      lastDate: dashboard.lastdate_outcome,
    }));
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

  protected initDashboard(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.FETCH_DASHBOARD())
    );
  }

  protected initMain(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.INIT_DASHBOARD())
    );
  }
}
