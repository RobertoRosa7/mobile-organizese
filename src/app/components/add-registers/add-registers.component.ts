/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Register } from 'src/app/interfaces/general';

@Component({
  selector: 'app-add-registers',
  templateUrl: './add-registers.component.html',
  styleUrls: ['./add-registers.component.scss'],
})
export class AddRegistersComponent implements OnInit {
  @Input() public type: string;
  @Input() public profile: any;
  @Input() public edit: boolean;
  @Input() public extract: any;

  @Output() public sendPayload = new EventEmitter();

  public categories$: Observable<any>;
  public isLoading = false;
  public isMobile = false;

  public form: FormGroup = this.fb.group({
    date: [''],
    value: [''],
    category: [''],
    description: [''],
  });

  public settings = {
    minYear: (new Date().getFullYear() - 70).toString(),
    maxYear: new Date().getFullYear().toString(),
    months: 'Jan, Fev, Mar, Abr, Mai, Jun, Jul, Aug, Sep, Out, Nov, Dez',
  };

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private breakpoint: BreakpointObserver
  ) {
    this.breakpoint
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit() {
    this.categories$ = this.store
      .select(({ registers }: any) => ({
        categories: registers.categories,
      }))
      .pipe(map((state) => state.categories));

    if (this.edit) {
      this.form.patchValue({
        description: this.extract.description,
        value: this.extract.value,
        category: this.extract.category,
        date: new Date(this.extract.created_at * 1000),
      });
    }
  }

  public formatterTitle(text: string): string {
    switch (text) {
      case 'incoming':
        return 'Receita';
      case 'outcoming':
        return 'Despesas';
    }
  }

  public onSubmit(event): void {
    const payload: Register = {
      category: this.form.value.category || 'Outros',
      created_at: this.getDateCreated(),
      updated_at: this.getDateCreated(),
      type: this.type,
      value: this.form.value.value,
      status: this.edit ? this.extract.status : 'pending',
      brand: this.form.value.brand || '',
      edit: false,
      user: {
        ...this.profile.user,
        _id: this.edit
          ? { $oid: this.profile.user._id }
          : this.profile.user._id,
      },
      description: this.form.value.description?.trim() || 'Sem descrição',
      cat_icon: this.edit ? this.extract.cat_icon : '',
    };

    if (this.edit) {
      payload._id = this.extract._id;
    }

    this.sendPayload.emit({ payload });
  }

  public close(options?): void {
    this.sendPayload.emit(undefined);
  }

  private getDateCreated(): number {
    return this.form.value.date
      ? new Date(this.form.value.date).getTime() / 1000
      : new Date().getTime() / 1000;
  }
}
