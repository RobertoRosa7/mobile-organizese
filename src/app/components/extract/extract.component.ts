/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import * as moment from 'moment';
import { Register } from 'src/app/interfaces/general';
import { DELETE_REGISTERS } from '../../actions/registers.actions';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, OnChanges {
  @Input() public data;
  public list;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store,
    private as: ActionsSubject
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.list = changes.data.currentValue;
  }

  public formatterValue(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(value.toFixed(2)));
  }

  public returnColor(extract: any): string {
    if (extract.type === 'outcoming') {
      return 'var(--danger)';
    } else if (extract.type === 'incoming') {
      return 'var(--green-microsoft)';
    }
  }

  public formatterDate(timestamp: number): Date {
    return new Date(timestamp);
  }

  public async remove(payload: any): Promise<any> {
    const modal = await this.alertController.create({
      header: `R$ ${this.formatterValue(payload.value)}`,
      message: 'Tem certeza que quer excluir?',
      cssClass: 'dialog-confirm',
      buttons: [
        {
          text: 'Excluir',
          cssClass: 'btn-delete',
          handler: () => this.store.dispatch(DELETE_REGISTERS({ payload })),
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await modal.present();
  }

  public async edit(extract: Register): Promise<any> {
    const modal = await this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        data: {
          edit: true,
          type: 'add-registers',
          operation: extract.type,
          profile: this.store.select(({ profile }: any) => ({
            user: profile.profile,
          })),
          extract,
        },
      },
    });
    await modal.present();
    await modal.onDidDismiss();
  }
  public returnClassByCategory(extract: Register): string {
    if (extract.status === 'pendente a pagar') {
      return 'color-icons-pending';
    } else if (extract.type === 'incoming' && extract.status === 'concluído') {
      return 'color-icons-incoming';
    } else if (extract.type === 'outcoming' && extract.status === 'concluído') {
      return 'color-icons-outcoming';
    } else {
      return '';
    }
  }

  private groupByDay(list: any): any {
    const listsByDays = list.map((i: any) => this.getIsoDay(i))
      .reduce((prev: any, current: any) => this.setGroupByDays(prev, current), [])
      .map((item: any) => this.setSumDailyValues(item));
    const listsByYears = list.map((i: any) => this.getIsoDay(i))
    .reduce((prevYear, currentYear) => this.setGroup(prevYear, currentYear, 'year'), [])
    .map(valueYear => ({
      ...valueYear,
      list: valueYear.list.reduce((prevMonth, currentMonth) => this.setGroup(prevMonth, currentMonth, 'month'), [])
        .map(valueMonth => ({
        ...valueMonth,
        list: valueMonth.list.reduce((prevDay, currentDay) => this.setGroup(prevDay, currentDay, 'day'), [])
        .map((valueDay) => this.setSumDailyValues(valueDay))
      }))
    }));
    return listsByDays;
  }

  private setGroup(prev, current, mode ) {
    let index = prev.findIndex((i) => moment(i[mode])[mode]() === moment(current.date)[mode]());
    if (index < 0) {
      index = prev.length;
      prev.push({ [mode]: new Date(current.date).getTime(), list: [] });
    }
    prev[index].list.push(current);
    return prev;
  }

  private setGroupByMonths(prev: any, current: any) {
    let index = prev.findIndex((i: any) => moment(i.month).month() === moment(current.date).month());
    if (index < 0) {
      index = prev.length;
      prev.push({ month: current.date, list: [] });
    }
    prev[index].list.push(current);
    return prev;
  }

  private setGroupByDays(prev, current) {
    let index = prev.findIndex((i: any) => moment(i.day).day() === moment(current.date).day());
    if (index < 0) {
      index = prev.length;
      prev.push({ day: current.date, list: [] });
    }
    prev[index].list.push(current);
    return prev;
  }

  private setGroupByYears(prev, current) {
    let index = prev.findIndex((i: any) => moment(i.year).year() === moment(current.date).year());
    if (index < 0) {
      index = prev.length;
      prev.push({ year: current.date, list: [] });
    }
    prev[index].list.push(current);
    return prev;
  }

  private setSumDailyValues(values: any) {
    return {
      ...values,
      day: new Date(values.day).getTime(),
      total_credits: values.list
        .map((v: any) => (v.type === 'incoming' ? v.value : 0))
        .reduce((v, i) => v + i),
      total_debits: values.list
        .map((v: any) => (v.type === 'outcoming' ? v.value : 0))
        .reduce((v, i) => v + i),
    };
  }

  private getIsoDay(value) {
    return { ...value, date: new Date(value.created_at * 1000) };
  }
}
