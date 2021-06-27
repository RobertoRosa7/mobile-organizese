import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Chip, Register } from 'src/app/interfaces/general';
import { SubjectService } from 'src/app/services/subject.service';
import { INIT } from '../../../actions/registers.actions';
@Component({
  selector: 'app-extracts',
  templateUrl: './extracts.component.html',
  styleUrls: ['./extracts.component.scss'],
})
export class ExtractsComponent implements OnInit {
  public registers$: Observable<Register[]>;
  public carouselOptions = {
    nav: false,
    lazyLoad: true,
    smartSpeed: 1000,
  };
  public chipSelected: boolean;
  public chipActivate: Chip;
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

  constructor(private store: Store, private subjectService: SubjectService) {}

  ngOnInit() {
    this.chipActivate = this.chips.filter((chip: Chip) => chip.selected)[0];
    this.initExtract();
  }

  public onChipChange(_: Chip, index: number): void {
    this.chips.forEach((chip: Chip, i: number) => ({
      ...chip,
      selected: (chip.selected = index === i),
    }));
    this.fetchRegisters(this.checkChip(_));
    this.chipActivate = this.chips.filter((chip: Chip) => chip.selected)[0];
  }

  private async initExtract(): Promise<any> {
    await this.fetchRegisters(this.checkChip(this.chipActivate));
    this.registers$ = this.store
      .select(({ registers }: any) => ({
        all: registers.all,
      }))
      .pipe(map((state) => state.all));
  }

  private async fetchRegisters(dates?: any): Promise<any> {
    return Promise.resolve(this.store.dispatch(INIT({ payload: dates })));
  }

  private checkChip(chip: Chip): any {
    return chip.value === 'todos'
      ? { todos: chip.value }
      : { days: chip.value };
  }
}
