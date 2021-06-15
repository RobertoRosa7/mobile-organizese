/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  DoCheck,
  Input,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {
  DELETE_REGISTERS,
  UPDATE_REGISTER,
} from '../../actions/registers.actions';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, DoCheck {
  @Input() public data: any;
  public differ: any;
  public listGroupByDay: any[];

  constructor(
    private differs: KeyValueDiffers,
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store
  ) {
    this.differ = this.differs.find({}).create();
  }

  ngOnInit() {}

  ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'data') {
          this.listGroupByDay = this.groupByDay(this.data.all);
        }
      });
    }
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
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          handler: () => this.store.dispatch(DELETE_REGISTERS({ payload })),
        },
      ],
    });
    await modal.present();
  }

  public async edit(extract: any): Promise<any> {
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
    const event = (await modal.onDidDismiss()).data;
    if (event) {
      this.store.dispatch(UPDATE_REGISTER({ payload: event.payload }));
    }
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
