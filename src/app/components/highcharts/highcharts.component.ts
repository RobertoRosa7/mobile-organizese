/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  DoCheck,
  ElementRef,
  Input,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartService } from 'src/app/services/chart.service';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import {
  FETCH_DATES,
  PUT_GRAPH_OUTCOME_INCOME,
} from '../../actions/dashboard.actions';
@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit, DoCheck {
  @ViewChild('highchart', { static: true }) public highchart: ElementRef;
  @Input() public data: any;

  @Input() public dtStart: Date;
  @Input() public dtEnd: Date;
  @Input() public type: string;
  @Input() public minDate: Date = new Date('1921-01-01');

  public enableButtonFilter = true;
  public isMobile: boolean;
  public setDtStart: any;
  public setDtEnd: any;
  public differ: any;

  constructor(
    private chartService: ChartService,
    private differs: KeyValueDiffers,
    private breakpoint: BreakpointObserver,
    private store: Store
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'data') {
          this.chartService.getCharts().subscribe((chart) => {
            if (this.data.outcomeIncome.length > 0) {
              this.dtEnd = this.data.dtEnd;
              this.dtStart = this.data.dtStart;
              chart.chart.type = 'spline';
              chart.series = this.data.outcomeIncome;
              chart.xAxis.categories = this.data.outcomeIncome[0].dates;
              Highcharts.chart(this.highchart.nativeElement, chart);
            }
          });
        }
      });
    }
  }

  public onSubmit(): void {
    this.store.dispatch(
      FETCH_DATES({
        payload: {
          dt_end: moment(this.dtEnd),
          dt_start: moment(this.dtStart),
        },
      })
    );
    setTimeout(() => this.store.dispatch(PUT_GRAPH_OUTCOME_INCOME()), 100);
  }

  public filterEnd = (d: any): boolean =>
    moment(d).isSameOrAfter(moment(new Date()));

  public filterStart = (d: any): boolean =>
    moment(d).isSameOrBefore(moment(new Date()));
}
