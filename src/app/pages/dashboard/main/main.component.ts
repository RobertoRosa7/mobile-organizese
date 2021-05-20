import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardPage } from '../dashboard.page';
import * as actionsDashboard from '../../../actions/dashboard.actions';
import { Observable } from 'rxjs';
import { SourceErrors } from 'src/app/actions/errors.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit {
  public isLoaded: boolean;
  public error$: Observable<any>;
  public dashboard$: Observable<any>;

  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: 'account_balance',
      value: 0,
      type: 'consolidado',
      percent: 0,
    },
    {
      title: 'Credito',
      icon: 'account_balance',
      value: 0,
      type: 'incoming',
      percent: 0,
    },
    {
      title: 'Debito',
      icon: 'account_balance',
      value: 0,
      type: 'outcoming',
      percent: 0,
    },
  ];
  constructor(protected store: Store) {
    super();
  }

  public async ngOnInit() {
    await this.initializingMain();
    this.dashboard$ = this.store.select(({ dashboard, errors }: any) => ({
      consolidado: this.cards.map((value: any) => {
        switch (value.type) {
          case 'incoming':
            value.value = dashboard.consolidado.total_credit || 0;
            value.percent = dashboard.consolidado.percent_credit || 0;
            break;
          case 'outcoming':
            value.value = dashboard.consolidado.total_debit || 0;
            value.percent = dashboard.consolidado.percent_debit || 0;
            break;
          case 'consolidado':
            value.value = dashboard.consolidado.total_consolidado || 0;
            value.percent = dashboard.consolidado.percent_consolidado;
            break;
        }
        return value;
      }),
      outcomeIncome: dashboard.outcome_income,
      lastdate: dashboard.lastdate_outcome.dt_start,
      all: dashboard.registers,
      err:
        errors.error.source === SourceErrors.INIT_DASHBOARD
          ? errors.error.error
          : undefined,
    }));
    this.isLoaded = true;
  }

  private initializingMain(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.initMain();
      setTimeout(() => resolve(true), 500);
    });
  }

  private initMain(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.INIT_DASHBOARD())
    );
  }
}
