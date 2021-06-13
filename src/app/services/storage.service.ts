import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private localStore: Observable<Storage>;
  constructor(private storage: Storage) {
    this.localStore = this.store();
  }

  public setStore(key: string, value: any): Observable<Storage> {
    return this.localStore.pipe(mergeMap((store) => store.set(key, value)));
  }

  public getStore(name: string): Observable<Storage> {
    return this.localStore.pipe(mergeMap((store) => store.get(name)));
  }

  public removeItem(name: string): Observable<Storage> {
    return this.localStore.pipe(mergeMap((store) => store.remove(name)));
  }

  public getAllKeys(): Observable<string[]> {
    return this.localStore.pipe(mergeMap((store) => store.keys()));
  }

  public getLength(): Observable<number> {
    return this.localStore.pipe(mergeMap((store) => store.length()));
  }

  public clear(): Observable<void> {
    return this.localStore.pipe(mergeMap((store) => store.clear()));
  }

  private store(): Observable<Storage> {
    return from(this.storage.create());
  }
}
