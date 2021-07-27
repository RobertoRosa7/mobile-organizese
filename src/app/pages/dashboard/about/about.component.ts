import { Component, OnInit } from '@angular/core';
import * as settings from '../../../../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public ver: any;
  public settings: any;

  constructor() {}

  ngOnInit() {
    this.settings = settings;
  }
}
