/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extract-empty',
  templateUrl: './extract-empty.component.html',
  styleUrls: ['./extract-empty.component.scss'],
})
export class ExtractEmptyComponent implements OnInit {
  @Input() public isLoading: boolean;
  @Input() public isData: boolean;
  public shadow = [
    {
      year: 1627242720000,
      list: [
        {
          month: 1627242720000,
          list: [
            {
              day: 1627242720000,
              list: [1,2,3],
            },
          ]
        }
      ]
    }
  ];

  constructor() { }
  ngOnInit() {
  }
}
