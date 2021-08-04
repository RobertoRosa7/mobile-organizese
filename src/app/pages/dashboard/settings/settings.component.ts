import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actionsApp from '../../../actions/app.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(actionsApp.HIDE_BUTTON_BACK({payload: true}));
  }
}
