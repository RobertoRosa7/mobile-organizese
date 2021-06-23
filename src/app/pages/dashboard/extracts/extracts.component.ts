import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chip } from 'src/app/interfaces/general';
import { INIT } from '../../../actions/registers.actions';
@Component({
  selector: 'app-extracts',
  templateUrl: './extracts.component.html',
  styleUrls: ['./extracts.component.scss'],
})
export class ExtractsComponent implements OnInit {
  public all$: Observable<any>;
  public carouselOptions = {
    nav: false,
    lazyLoad: true,
    smartSpeed: 1000,
  };
  public chipSelected: boolean;
  public chips: Chip[] = [
    {
      label: '7 dias',
      value: 7,
      selected: true,
    },
    {
      label: '15 dias',
      value: 15,
      selected: false,
    },
    {
      label: '30 dias',
      value: 30,
      selected: false,
    },
    {
      label: 'todos',
      value: 'todos',
      selected: false,
    },
  ];

  constructor(private store: Store) {}

  ngOnInit() {
    this.initExtract();
  }

  public onChipChange(_: Chip, index: number): void {
    this.chips.forEach((chip: Chip, i: number) => ({
      ...chip,
      selected: (chip.selected = index === i),
    }));
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
