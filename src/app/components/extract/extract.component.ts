/* eslint-disable @typescript-eslint/naming-convention */
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  Component,
  DoCheck,
  Input,
  KeyValueDiffers,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, DoCheck {
  @Input() public data: any;
  public differ: any;
  public listGroupByDay: any[];

  constructor(private differs: KeyValueDiffers) {
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
