import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';
import { LoginPage } from '../login.page';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent extends LoginPage implements OnInit {
  public text = 'E-mail não verificado!';
  public isVerified$: Observable<any>;

  constructor(
    protected toastController: ToastController,
    protected loginService: LoginService,
    private activatedRoute: ActivatedRoute,
  ) {
    super(toastController, loginService);
  }

  ngOnInit() {
    this.isVerified$ = this.activatedRoute.queryParams.pipe(
      switchMap((params: any) => this.mapCheckIfToken(params)),
      catchError((err) => {
        this.text =
          'Crie uma nova senha de acesso. (login > esqueci a senha > digite seu e-mail)';
        return err;
      }));
  }

}
