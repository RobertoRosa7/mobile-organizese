import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmptyService {
  public loadingExtract$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public dataExtract$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loadingExtractPage$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public dataExtractPage$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loadingHighchart$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public dataHighchart$: BehaviorSubject<any> = new BehaviorSubject(null);

  public loadingCardsMain$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public dataCardsMain$: BehaviorSubject<any> = new BehaviorSubject(null);

  public setLoadingExtract(payload: boolean): void {
    this.loadingExtract$.next(payload);
  }

  public setDataExtract(payload: any): void {
    this.dataExtract$.next(payload);
  }

  public setLoadingExtractPage(payload: boolean): void {
    this.loadingExtractPage$.next(payload);
  }

  public setDataExtractPage(payload: any): void {
    this.dataExtractPage$.next(payload);
  }

  public setLoadingHighchart(payload: boolean): void {
    this.loadingHighchart$.next(payload);
  }

  public setDataHighchart(payload: any): void {
    this.dataHighchart$.next(payload);
  }

  public setLoadingCardsMain(payload: boolean): void {
    this.loadingCardsMain$.next(payload);
  }

  public setDataCardsMain(payload: any): void {
    this.dataCardsMain$.next(payload);
  }
}
