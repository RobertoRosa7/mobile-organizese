import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SourceErrors } from 'src/app/actions/errors.actions';
import * as actionsApp from '../../../actions/app.actions';
import { DashboardPage } from '../dashboard.page';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends DashboardPage implements OnInit {
  public isLoaded = false;
  public error$: Observable<any>;
  public dashboard$: Observable<any>;

  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: '',
      show: true,
      value: 0,
      type: 'consolidado',
      percent: 0,
    },
    {
      title: 'Crédito',
      icon: '',
      show: true,
      value: 0,
      type: 'incoming',
      percent: 0,
    },
    {
      title: 'Débito',
      icon: '',
      show: true,
      value: 0,
      type: 'outcoming',
      percent: 0,
    },
  ];
  constructor(protected store: Store) {
    super();
  }

  public ngOnInit() {
    this.initializingMain();
  }

  private async initializingMain(): Promise<any> {
    await this.initHideValues();
    this.fetchStore();
    this.isLoaded = true;
  }

  private fetchStore() {
    this.dashboard$ = this.store.select(({ dashboard, errors, app }: any) => ({
      consolidado: this.cards.map((value: any) => {
        value.show = app.hidevalues;
        value.icon = app.hidevalues ? 'eye' : 'eye-off';
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
  }

  private initHideValues(): Promise<any> {
    return Promise.resolve(this.store.dispatch(actionsApp.GET_HIDE_VALUES()));
  }
}
