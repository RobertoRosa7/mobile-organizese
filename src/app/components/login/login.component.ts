import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() sendClose = new EventEmitter();
  public changeTexts = true;

  public login: FormGroup = this.formBuild.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    keepConnect: [false],
  });

  constructor(protected formBuild: FormBuilder) {}

  ngOnInit() {}

  public onSubmit(event: Event): void {
    event.preventDefault();
    console.log(this.login.value);
  }

  public close(): void {
    this.sendClose.emit({ status: false });
  }
}
