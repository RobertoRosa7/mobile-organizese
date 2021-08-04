import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as settings from '../../../../../package.json';
import * as actionsApp from '../../../actions/app.actions';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public ver: any;
  public settings: any;

  constructor(
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(actionsApp.HIDE_BUTTON_BACK({payload: true}));
    this.settings = settings;
  }
}
