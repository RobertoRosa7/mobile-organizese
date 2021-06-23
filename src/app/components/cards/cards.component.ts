import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as actionsApp from '../../actions/app.actions';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  public showValues = false;
  public consolidadoData$: Observable<any>;
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

  constructor(private store: Store) {}

  ngOnInit() {
    this.consolidadoData$ = this.store
      .select(({ dashboard, app }: any) => ({
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
      }))
      .pipe(map((state) => state.consolidado));
  }

  public formatterValue(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(value.toFixed(2)));
  }

  public formatterPercent(value: number): string {
    return value.toFixed(2);
  }

  public hideAndShowValues(event: MouseEvent): void {
    event.stopPropagation();
    this.showValues = !this.showValues;
    this.store.dispatch(
      actionsApp.SET_HIDE_VALUES({ payload: this.showValues })
    );
  }

  public returnClassValue(type: string): string {
    switch (type) {
      case 'consolidado':
        return 'var(--white-one)';
      case 'incoming':
        return 'var(--ion-color-success-tint)';
      case 'outcoming':
        return 'var(--ion-color-danger-tint)';
      default:
        return 'var(--white-one)';
    }
  }
}
