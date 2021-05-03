import { Component, OnInit } from '@angular/core';
import { DashboardPage } from '../dashboard.page';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
