import { Component, Input, OnInit } from '@angular/core';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-add-registers',
  templateUrl: './add-registers.component.html',
  styleUrls: ['./add-registers.component.scss'],
})
export class AddRegistersComponent implements OnInit {
  @Input() public type: string;

  constructor(private datePicker: DatePicker) {}

  ngOnInit() {
    console.log(this.type);
    this.datePicker
      .show({
        date: new Date(),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      })
      .then(
        (date) => console.log('Got date: ', date),
        (err) => console.log('Error occurred while getting date: ', err)
      );
  }

  public formatterTitle(text: string): string {
    switch (text) {
      case 'income':
        return 'Receita';
      case 'outcome':
        return 'Despesas';
    }
  }
}
