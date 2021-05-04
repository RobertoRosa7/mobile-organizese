import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardPage } from '../dashboard.page';
import * as actionsDashboard from '../../../actions/dashboard.actions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit {
  constructor(protected store: Store) {
    super();
  }

  public async ngOnInit() {
    // await this.initializingMain();
  }

  private initializingMain(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.initMain();
      setTimeout(() => resolve(true), 100);
    });
  }

  private initMain(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.INIT_DASHBOARD()))
    );
  }
}
