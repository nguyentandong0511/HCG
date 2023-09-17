import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginApi } from '../model/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  constructor(private _http: HttpClient) { }

  getToken(code: string) {
    return this._http.get<LoginApi.Response>(`getToken?code=${code}`, {});
  }
}
