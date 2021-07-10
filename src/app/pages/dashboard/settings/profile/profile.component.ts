import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public formProfile: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', Validators.required],
    tel: ['', Validators.required],
  });

  public isLoading = false;
  public user: any;
  public isReadOnly = false;

  constructor(protected store: Store, protected fb: FormBuilder) {}

  ngOnInit() {
    this.store
      .select(({ profile }: any) => ({ profile: profile.profile }))
      .pipe(map((state) => state.profile))
      .subscribe((profile) => {
        this.formProfile.patchValue({
          name: profile.name,
          email: profile.email,
          cpf: profile.cpf,
          tel: profile.tel,
        });
        this.isLoading = false;
      });
  }

  public onProfileSubmit(): void {}
}
