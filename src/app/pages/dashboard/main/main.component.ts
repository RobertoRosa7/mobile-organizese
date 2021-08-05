/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { Register } from 'src/app/interfaces/general';
import { EmptyService } from 'src/app/services/empty.service';
import { SubjectService } from 'src/app/services/subject.service';
import { UtilsService } from 'src/app/services/utils.service';
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
  public registersData: Observable<Register[]>;
  public highchCharts$: Observable<any>;
  public isContentLoaded: boolean;

  constructor(
    public emptyService: EmptyService,
    public subjectService: SubjectService,
    protected store: Store,
    protected routerOutlet: IonRouterOutlet
  ) {
    super();
  }

  ngOnInit() {
    this.routerOutlet.stackEvents.subscribe((ev) =>
      this.store.dispatch(actionsApp.HIDE_BUTTON_BACK({payload: ev.enteringView.stackId !== 'main'})));
      this.initializingMain();
  }

  protected async initializingMain(): Promise<any> {
    await this.initHideValues();
    await this.initGraphOutcomeIncome();
    await this.initLastDateOutcomeIncome();
    await this.initDatesGraph();
    await this.initDashboard();
    await this.initMain();
    this.getDataToHighchart();
    this.getDataToDashboard();
    await this.waitTimeDefault(2000);
  }

  protected getDataToHighchart() {
    this.emptyService.loadingHighchart$.next(true);

    this.store.select(({ dashboard }: any) => ({
        outcomeIncome: dashboard.outcome_income,
        dt_start: dashboard.graph_dates.dt_start,
        dt_end: dashboard.graph_dates.dt_end,
        lastDate: dashboard.lastdate_outcome,
      })).pipe(map((state) => state)).subscribe(st => {
        if (st.outcomeIncome.length > 0) {
          this.emptyService.dataHighchart$.next(st);
          setTimeout(() => this.emptyService.loadingHighchart$.next(false), UtilsService.getTimeDefault());
        } else {
          this.emptyService.dataHighchart$.next(null);
          setTimeout(() => this.emptyService.loadingHighchart$.next(false), UtilsService.getTimeDefault());
        }
      });
  }

  protected getDataToDashboard() {
    this.emptyService.setLoadingExtract(true);
    this.store.select(({ dashboard }: any) => ({ all: dashboard.registers })).pipe(map((state) => state.all))
      .subscribe((registers) => {
        if (registers.length > 0) {
          this.emptyService.setDataExtract(registers);
          setTimeout(() => this.emptyService.setLoadingExtract(false), UtilsService.getTimeDefault());
        } else {
          this.emptyService.setDataExtract(null);
          setTimeout(() => this.emptyService.setLoadingExtract(false), UtilsService.getTimeDefault());
        }
      });
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

  // init dashboard é para buscar o consolidado
  protected initMain(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.INIT_DASHBOARD())
    );
  }

  protected onActionsTypes(type: string): Observable<any> {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }

  protected waitTimeDefault(time) {
    return Promise.resolve(setTimeout(() => (this.isLoaded = true), UtilsService.getTimeDefault(time)));
  }
}
