import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);

  getInternalJsonData<T>(): Observable<T> {
    const randomNumber = new Date(Date.now()).getMilliseconds().toString();
    const lastChar = randomNumber[randomNumber.length - 1];
    const isWrong = +lastChar === 1

    return this.http.get(`/public/${isWrong ? '' : 'db'}.json`) as Observable<T>;
  }
}
