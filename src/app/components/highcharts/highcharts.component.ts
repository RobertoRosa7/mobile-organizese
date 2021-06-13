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

@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
})
export class HighchartsComponent implements OnInit, DoCheck {
  @ViewChild('highchart', { static: true }) public highchart: ElementRef;
  @Input() public data: any;

  public highchartData: any;
  public differ: any;

  constructor(
    private chartService: ChartService,
    private differs: KeyValueDiffers
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'data') {
          this.startChart(this.data);
        }
      });
    }
  }

  private startChart(data) {
    this.chartService.getCharts().subscribe((chart) => {
      chart.chart.type = 'spline';
      if (data.length > 0) {
        chart.series = data;
        chart.xAxis.categories = data[0].dates;
      }
      Highcharts.chart(this.highchart.nativeElement, chart);
    });
  }
}
