/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Register, RegisterByDay } from 'src/app/interfaces/general';
import { DELETE_REGISTERS } from '../../actions/registers.actions';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, OnChanges {
  @Input() public data: Register[];
  public listGroupByDay$: Observable<RegisterByDay[]>;
  public listGroupByDay2$: BehaviorSubject<RegisterByDay[]> =
    new BehaviorSubject(null);
  public list: RegisterByDay[] = [];

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store,
    private as: ActionsSubject
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    timer(1000)
      .pipe(
        tap(() =>
          this.listGroupByDay2$.next(this.groupByDay(changes.data.currentValue))
        )
      )
      .subscribe();
    timer(1500).subscribe(() => {
      this.listGroupByDay2$.subscribe(
        (list: RegisterByDay[]) => (this.list = list)
      );
    });
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

  private groupByDay(list: any): any {
    return list
      .map((i: any) => ({ ...i, day: new Date(i.created_at * 1000) }))
      .reduce((prev: any, current: any) => {
        let index = prev.findIndex(
          (i: any) =>
            new Date(i.day).getDay() === new Date(current.day).getDay()
        );
        if (index < 0) {
          index = prev.length;
          prev.push({ day: current.day, list: [] });
        }
        prev[index].list.push(current);
        return prev;
      }, [])
      .map((item: any) => ({
        ...item,
        day: new Date(item.day).getTime(),
        total_credits: item.list
          .map((v: any) => (v.type === 'incoming' ? v.value : 0))
          .reduce((v, i) => v + i),
        total_debits: item.list
          .map((v: any) => (v.type === 'outcoming' ? v.value : 0))
          .reduce((v, i) => v + i),
      }));
  }
}
