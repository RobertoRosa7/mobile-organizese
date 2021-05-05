import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss'],
})
export class FormsComponent implements OnInit {
  public changeTexts = true;

  public forms: FormGroup;

  constructor(protected formBuild: FormBuilder) {}

  ngOnInit() {
    this.forms = this.formBuild.group({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.forms.value);
  }
}
