import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Observable, pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit, OnChanges {
  @ViewChild('highchart', { static: true }) public highchart: ElementRef;
  @Input() public data: any;

  constructor(private chartService: ChartService) {}

  ngOnInit() {
    this.chartService
      .getCharts()
      .pipe(
        delay(300),
        map((chart) => {
          chart.chart.type = 'spline';
          chart.series = this.data.outcomeIncome;
          chart.xAxis.categories = this.data.outcomeIncome[0].dates;
          return chart;
        })
      )
      .subscribe((chart) =>
        Highcharts.chart(this.highchart.nativeElement, chart)
      );
  }
  ngOnChanges() {
    console.log();
  }
}
