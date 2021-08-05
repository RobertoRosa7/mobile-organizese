/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
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
}

