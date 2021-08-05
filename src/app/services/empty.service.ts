import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmptyService {
  public loadingExtract$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  public dataExtract$: BehaviorSubject<any> = new BehaviorSubject(null);

  public setLoadingExtract(payload: boolean): void {
    this.loadingExtract$.next(payload);
  }

  public setDataExtract(payload: any): void {
    this.dataExtract$.next(payload);
  }
}
