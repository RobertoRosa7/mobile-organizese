/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  Input, OnInit, ViewChild
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { BehaviorSubject, forkJoin, Observable, of, timer } from 'rxjs';
import { filter, map, mergeMap, tap, delay } from 'rxjs/operators';
import { ChartService } from 'src/app/services/chart.service';
import { EmptyService } from 'src/app/services/empty.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as actionsApp from '../../actions/app.actions';
import * as actionsDashboard from '../../actions/dashboard.actions';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit {
  @ViewChild('highchart', { static: true }) public highchart: ElementRef;
  @Input() public type: string;
  @Input() public data: Observable<any>;

  public high$: BehaviorSubject<any> = new BehaviorSubject(null);
  public dtStart: Date;
  public dtEnd: Date;
  public minDate: Date = new Date('1920-01-01');
  public highchartData$: Observable<any>;
  public isMobile: boolean;
  public setDtStart: any;
  public setDtEnd: any;
  public differ: any;
  public btnLoadingSpinner: boolean;
  public enableButtonFilter: boolean;

  constructor(
    public emptyService: EmptyService,
    private chartService: ChartService,
    private breakpoint: BreakpointObserver,
    private store: Store,
    private as: ActionsSubject,
  ) {
    this.breakpoint?.observe([Breakpoints.XSmall]).subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit() {
    this.prepareToChart().subscribe((chart => this.buildChart(chart)));
    this.onActionsTypes(actionsApp.ActionsTypes.UPGRADE).pipe(
      delay(1000),
      mergeMap(() => this.prepareToChart()))
      .subscribe((chart) => this.buildChart(chart));
  }

  public buildChart(chart) {
    Highcharts.chart(this.highchart.nativeElement, chart);
    this.btnLoadingSpinner = false;
  }

  public onSubmit(): void {
    this.btnLoadingSpinner = true;
    this.store.dispatch(
      actionsDashboard.PUT_DATES({
        payload: {
          dt_end: moment(this.dtEnd).toLocaleString(),
          dt_start: moment(this.dtStart).toLocaleString(),
        },
      })
    );

    timer(UtilsService.getTimeDefault()).pipe(
      tap(() => this.store.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME())),
      delay(1000),
      mergeMap(() => this.prepareToChart())).subscribe((chart) => this.buildChart(chart));
  }

  public filterEnd = (d: any): boolean =>
    moment(d).isSameOrAfter(moment(new Date()));

  public filterStart = (d: any): boolean =>
    moment(d).isSameOrBefore(moment(new Date()));

  private mapToChart(chart, states): any {
    if (states.outcomeIncome[0].dates.length === 0) {
      this.dtEnd = null;
      this.dtStart = null;
      this.minDate = null;
      this.enableButtonFilter = true;
    } else {
      this.dtEnd = new Date(states.dt_end);
      this.dtStart = new Date(states.dt_start);
      this.minDate = new Date(states.lastDate.dt_start);
      this.enableButtonFilter = false;
    }

    chart.tooltip.backgroundColor = 'var(--white-one)';
    chart.chart.type = 'spline';
    chart.series = states.outcomeIncome;
    chart.xAxis.categories = states.outcomeIncome[0].dates;
    return chart;
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }

  private prepareToChart(): Observable<any> {
    return this.chartService.getCharts().pipe(
      mergeMap((chart) => forkJoin([ of(chart), of(this.emptyService.dataHighchart$.value) ])),
      map(([chartStructure, dataToChart]) => this.mapToChart(chartStructure, dataToChart)));
  }
}
