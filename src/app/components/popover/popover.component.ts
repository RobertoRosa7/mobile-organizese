import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Strings } from 'src/app/interfaces/strings';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() public type: string;
  @Input() public data: any;

  public profile$: Observable<any>;
  public notify$: Observable<any>;

  constructor(
    private modalController: ModalController,
    protected popoverController?: PopoverController
  ) {}

  ngOnInit() {
    switch (this.type) {
      case Strings.PROFILE:
        this.profile$ = this.data.profile;
        break;
      case Strings.NOTIFY:
        this.notify$ = this.data.notify;
        break;
    }
  }

  public async add(type: string): Promise<any> {
    this.popoverController.dismiss();
    const modal = await this.modal(type);
    await modal.present();
  }

  public formatterValue(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(value.toFixed(2)));
  }

  private async modal(type: string, data?: any): Promise<HTMLIonModalElement> {
    return this.modalController.create({
      component: ModalComponent,
      swipeToClose: true,
      componentProps: {
        type,
        data,
      },
    });
  }
}
