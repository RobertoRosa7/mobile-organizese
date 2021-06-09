import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper, MatStep } from '@angular/material/stepper';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ExtractComponent implements OnInit {
  // @ViewChild(MatStepper) stepper: MatStepper;
  @Input() public data: any;
  public listGroupByDay: any[];

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.listGroupByDay = this.groupByDay(this.data.all);
      // this.stepper.steps.forEach((st: MatStep) => {
      //   st.completed = true;
      //   st.state = st.state;
      // });
    }, 200);
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
      .map((item: any) => ({ ...item, day: new Date(item.day).getTime() }));
  }
}
