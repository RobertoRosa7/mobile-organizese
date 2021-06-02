/* eslint-disable @typescript-eslint/naming-convention */
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
  @Output() public sendPayload = new EventEmitter();

  public categories$: Observable<any>;

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

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit() {
    this.categories$ = this.store
      .select(({ registers }: any) => ({
        categories: registers.categories,
      }))
      .pipe(map((state) => state.categories));
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
      created_at: new Date(this.form.value.date).getTime() / 1000,
      updated_at: new Date(this.form.value.date).getTime() / 1000,
      type: this.type,
      value: this.form.value.value,
      status: 'pending',
      brand: this.form.value.brand || '',
      edit: false,
      user: this.profile,
      description: this.form.value.description?.trim() || 'Sem descrição',
    };

    this.sendPayload.emit({ payload });
  }

  public close(options?): void {
    this.sendPayload.emit(undefined);
  }
}
