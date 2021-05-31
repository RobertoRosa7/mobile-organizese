import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actionsApp from '../../actions/app.actions';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() public card: any;
  public showValues = false;

  constructor(private store: Store) {}

  ngOnInit() {}

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
}
