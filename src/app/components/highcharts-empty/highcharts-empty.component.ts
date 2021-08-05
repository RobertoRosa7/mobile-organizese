import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-highcharts-empty',
  templateUrl: './highcharts-empty.component.html',
  styleUrls: ['./highcharts-empty.component.scss'],
})
export class HighchartsEmptyComponent implements OnInit {
  @Input() public isLoading: boolean;
  @Input() public isData: boolean;

  constructor() { }

  ngOnInit() {}

}
