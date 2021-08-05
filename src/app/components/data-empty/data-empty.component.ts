import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-empty',
  templateUrl: './data-empty.component.html',
  styleUrls: ['./data-empty.component.scss'],
})
export class DataEmptyComponent implements OnInit {
  @Input() label: string;
  
  constructor() { }

  ngOnInit() {}

}
