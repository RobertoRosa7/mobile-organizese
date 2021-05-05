import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: Storage) {}

  public setStore(key: string, value: any): Observable<Storage> {
    return this.store().pipe(mergeMap((store) => store.set(key, value)));
  }

  public getStore(name: string): Observable<Storage> {
    return this.store().pipe(mergeMap((store) => store.get(name)));
  }

  public removeItem(name: string): Observable<Storage> {
    return this.store().pipe(mergeMap((store) => store.remove(name)));
  }

  public getAllKeys(): Observable<string[]> {
    return this.store().pipe(mergeMap((store) => store.keys()));
  }

  public getLength(): Observable<number> {
    return this.store().pipe(mergeMap((store) => store.length()));
  }

  public clear(): Observable<void> {
    return this.store().pipe(mergeMap((store) => store.clear()));
  }

  private store(): Observable<Storage> {
    return from(this.storage.create());
  }
}
