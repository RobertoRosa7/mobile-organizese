import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { RESET_ERRORS } from '../../actions/errors.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() public type: string;

  constructor(
    private modalController: ModalController,
    private store: Store,
    private router: NavController
  ) {}

  ngOnInit() {}

  public close(): void {
    this.modalController.dismiss({ teste: this.type });
    this.store.dispatch(RESET_ERRORS());
  }

  public onClose(event): void {
    if (event) {
      this.router.navigateForward('/dashboard');
    }
    this.store.dispatch(RESET_ERRORS());
    this.modalController.dismiss(event);
  }
}
