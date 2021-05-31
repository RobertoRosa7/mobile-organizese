import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  @Input() public type: string;

  constructor(
    private modalController: ModalController,
    protected popoverController?: PopoverController
  ) {}

  ngOnInit() {}

  public async add(type: string): Promise<any> {
    this.popoverController.dismiss();
    const modal = await this.modal(type);
    await modal.present();
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
