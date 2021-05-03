import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actionsApp from '../../actions/app.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  constructor(private store?: Store) {}

  ngOnInit() {
    console.log('its working!');
    this.store?.dispatch(actionsApp.onLine());
  }
}
