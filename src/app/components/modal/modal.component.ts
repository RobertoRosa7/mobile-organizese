import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() public type: string;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  public close(): void {
    this.modalController.dismiss({ teste: this.type });
  }
}
