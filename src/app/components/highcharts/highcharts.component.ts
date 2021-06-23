/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  ElementRef,
  Input,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActionsSubject, Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Observable, of, timer } from 'rxjs';
import { filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { ChartService } from 'src/app/services/chart.service';
import * as actionsDashboard from '../../actions/dashboard.actions';
import {
  PUT_DATES,
  PUT_GRAPH_OUTCOME_INCOME,
} from '../../actions/dashboard.actions';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit {
  @ViewChild('highchart', { static: true }) public highchart: ElementRef;
  @Input() public type: string;

  public dtStart: Date;
  public dtEnd: Date;

  public minDate: Date = new Date('1920-01-01');
  public highchartData$: Observable<any>;
  public enableButtonFilter = true;
  public isMobile: boolean;
  public setDtStart: any;
  public setDtEnd: any;
  public differ: any;
  public btnLoadingSpinner: boolean;

  constructor(
    private chartService: ChartService,
    private differs: KeyValueDiffers,
    private breakpoint: BreakpointObserver,
    private store: Store,
    private as: ActionsSubject
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {
    this.instanceChart();

    this.onActionsTypes(
      actionsDashboard.actionsTypes.SET_GRAPH_OUTCOME_INCOME
    ).subscribe({
      next: ({ payload }) => this.instanceChart(),
    });
  }

  public onSubmit(): void {
    this.btnLoadingSpinner = true;
    this.store.dispatch(
      PUT_DATES({
        payload: {
          dt_end: moment(this.dtEnd).toLocaleString(),
          dt_start: moment(this.dtStart).toLocaleString(),
        },
      })
    );
    timer(1000).subscribe(() =>
      this.store.dispatch(PUT_GRAPH_OUTCOME_INCOME())
    );
  }

  public filterEnd = (d: any): boolean =>
    moment(d).isSameOrAfter(moment(new Date()));

  public filterStart = (d: any): boolean =>
    moment(d).isSameOrBefore(moment(new Date()));

  private instanceChart() {
    const store$ = this.store.select(({ dashboard }: any) => ({
      outcomeIncome: dashboard.outcome_income,
      dt_start: dashboard.graph_dates.dt_start,
      dt_end: dashboard.graph_dates.dt_end,
      lastDate: dashboard.lastdate_outcome,
    }));
    timer(1000)
      .pipe(
        withLatestFrom(store$),
        mergeMap(([_, states]) =>
          this.chartService
            .getCharts()
            .pipe(map((chart) => this.mapToChart(chart, states)))
        )
      )
      .subscribe({
        next: (chart) => Highcharts.chart(this.highchart.nativeElement, chart),
        error: (e) => console.error(e),
        complete: () => (this.btnLoadingSpinner = false),
      });
  }

  private mapToChart(chart, states): any {
    this.dtEnd = new Date(states.dt_end);
    this.dtStart = new Date(states.dt_start);
    this.minDate = new Date(states.lastDate.dt_start);
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
