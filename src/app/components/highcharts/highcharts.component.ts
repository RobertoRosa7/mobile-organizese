/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ChartService } from 'src/app/services/chart.service';
import * as actionsDashboard from '../../actions/dashboard.actions';
import * as actionsApp from '../../actions/app.actions';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit, OnChanges {
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
  private chart: any;
  private datachart: any;

  constructor(
    private chartService: ChartService,
    private breakpoint: BreakpointObserver,
    private store: Store,
    private as: ActionsSubject
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.high$.next(this.data);
    this.chartService.getCharts().subscribe((chart) => (this.chart = chart));
    this.high$.subscribe((data) => (this.datachart = data));
  }

  ngOnInit() {
    setTimeout(
      () =>
        this.buildHighchart(this.chart, this.datachart).subscribe((chart) =>
          this.buildChart(chart)
        ),
      UtilsService.getTimeDefault()
    );

    this.onActionsTypes(actionsApp.ActionsTypes.UPGRADE).subscribe(() =>
      setTimeout(
        () =>
          this.buildHighchart(this.chart, this.datachart).subscribe((chart) =>
            this.buildChart(chart)
          ),
        UtilsService.getTimeDefault()
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.high$.next(changes.data.currentValue);
  }

  public buildHighchart(chart, data): Observable<any> {
    return of(this.mapToChart(chart, data));
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

    timer(UtilsService.getTimeDefault()).subscribe(() => {
      this.store.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME());
      this.high$.subscribe((data) => (this.datachart = data));
      setTimeout(
        () =>
          this.buildHighchart(this.chart, this.datachart).subscribe((chart) =>
            this.buildChart(chart)
          ),
        UtilsService.getTimeDefault()
      );
    });
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
}
