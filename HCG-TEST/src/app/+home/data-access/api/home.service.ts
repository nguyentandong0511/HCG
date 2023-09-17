import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeApiModel } from '../model/home.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private _http: HttpClient) { }

  getUser() {
    return this._http.get<HomeApiModel.Response>(`user`, {});
  }

  getLanguage() {
    return this._http.get<HomeApiModel.LanguageResponse[]>(`languages`, {});
  }

  getRepo(model: HomeApiModel.repositoryRequest) {
    const params = new HttpParams({ fromObject: { ...model } });
    return this._http.get<Paging<HomeApiModel.repositoryResponse>>(`repository`, { params });
  }
}


export type Paging<T> = {
  pageNumber: number,
  pageSize: number,
  total_count: number
  items: T[];
};
