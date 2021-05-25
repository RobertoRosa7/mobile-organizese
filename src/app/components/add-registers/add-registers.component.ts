import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-registers',
  templateUrl: './add-registers.component.html',
  styleUrls: ['./add-registers.component.scss'],
})
export class AddRegistersComponent implements OnInit {
  @Input() public type: string;

  public settings = {
    minYear: (new Date().getFullYear() - 70).toString(),
    maxYear: new Date().getFullYear().toString(),
    months: 'Jan, Fev, Mar, Abr, Mai, Jun, Jul, Aug, Sep, Out, Nov, Dez',
  };

  constructor() {}

  ngOnInit() {}

  public formatterTitle(text: string): string {
    switch (text) {
      case 'income':
        return 'Receita';
      case 'outcome':
        return 'Despesas';
    }
  }
}
