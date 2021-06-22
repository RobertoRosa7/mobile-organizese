import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { INIT } from '../../../actions/registers.actions';
@Component({
  selector: 'app-extracts',
  templateUrl: './extracts.component.html',
  styleUrls: ['./extracts.component.scss'],
})
export class ExtractsComponent implements OnInit {
  public all$: Observable<any>;
  public carouselOptions = {
    autoWidth: true,
    nav: false,
    lazyLoad: true,
    loop: true,
  };
  public chips: any[] = [
    {
      label: '7 dias',
      value: 7,
    },
    {
      label: '15 dias',
      value: 15,
    },
    {
      label: '30 dias',
      value: 30,
    },
    {
      label: '60 dias',
      value: 60,
    },
    {
      label: 'todos',
      value: 'todos',
    },
  ];

  constructor(private store: Store) {}

  ngOnInit() {
    this.initExtract();
  }

  private async initExtract(): Promise<any> {
    await this.fetchRegisters();
    this.all$ = this.store
      .select(({ registers }: any) => ({
        all: registers.all,
      }))
      .pipe(map((state) => state));
  }

  private async fetchRegisters(): Promise<any> {
    return Promise.resolve(this.store.dispatch(INIT({ payload: { days: 7 } })));
  }
}
