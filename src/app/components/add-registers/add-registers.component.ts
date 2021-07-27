/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Register } from 'src/app/interfaces/general';
import { BuildsService } from 'src/app/services/builds.service';
import * as actionsError from '../../actions/errors.actions';
import * as actionsRegister from '../../actions/registers.actions';

@Component({
  selector: 'app-add-registers',
  templateUrl: './add-registers.component.html',
  styleUrls: ['./add-registers.component.scss'],
})
export class AddRegistersComponent implements OnInit {
  @Input() public type: string;
  @Input() public profile: any;
  @Input() public edit: boolean;
  @Input() public extract: Register;

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
    private breakpoint: BreakpointObserver,
    private as: ActionsSubject
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

  public onSubmit(_): void {
    this.isLoading = true;

    if (this.edit && this.extract) {
      this.store.dispatch(
        actionsRegister.UPDATE_REGISTER({
          payload: BuildsService.buildUpdateRegister(this.extract, this.form),
        })
      );
    } else {
      this.store.dispatch(
        actionsRegister.ADD_REGISTERS({
          payload: BuildsService.buildRegister(
            this.form,
            this.profile.user,
            this.type
          ),
        })
      );
    }

    this.onActionSubject(actionsError.actionsTypes.SET_SUCCESS).subscribe(
      () => {
        this.sendPayload.emit(true);
        this.isLoading = false;
      }
    );

    this.onActionSubject(actionsError.actionsTypes.SET_ERRORS).subscribe(() => {
      this.sendPayload.emit(true);
      this.isLoading = false;
    });
  }

  public close(_?): void {
    this.sendPayload.emit(undefined);
  }

  private onActionSubject(type: string) {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }
}
