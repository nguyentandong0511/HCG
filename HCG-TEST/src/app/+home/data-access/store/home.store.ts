import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, OnStoreInit, tapResponse } from '@ngrx/component-store';
import { switchMap, tap } from 'rxjs';
import { LoginApiService } from 'src/app/+auth/data-access/api/login-api.service';
import { AuthStore } from 'src/app/shared/data-access/store/auth.store';
import { lsSetKey } from 'src/app/shared/util/helper/local-storage-query';
import { HomeService } from '../api/home.service';
import { HomeApiModel } from '../model/home.model';
import * as moment from 'moment';

export interface HomeState {
    user: HomeApiModel.Response;
    repository: {
        items: HomeApiModel.repositoryResponse[],
        pageNumber: number
        pageSize: number
        total_count: number
    },
    languages: HomeApiModel.LanguageResponse[]
}

const initialState: HomeState = {
    user: {
        avatar_url: '',
        login: ''
    },
    repository: {
        items: [],
        pageNumber: 0,
        pageSize: 0,
        total_count: 0
    },
    languages: []
};

@Injectable({ providedIn: 'root' })
export class HomeStore extends ComponentStore<HomeState> implements OnStoreInit {
    pagingRequest: HomeApiModel.repositoryRequest = {
        per_page: 10,
        page: 1,
        order: 'desc',
        name: '',
        sort: '',
        owner: '',
        created_at: '',
        size: 0,
        language: ''
    };

    code = this._route.snapshot.queryParams['code']!;
    isLast = false;
    loading = false;
    isShowLanguage = false;
    isShowDate = false;
    isShowSize = false;
    isFilter = false;
    constructor(
        private _lSvc: LoginApiService,
        private _hSvc: HomeService,
        private _route: ActivatedRoute,
        private _aStore: AuthStore
    ) {
        super(initialState);
    }

    ngrxOnStoreInit() {
        this.getToken();
    }

    readonly getToken = this.effect($params =>
        $params.pipe(
            switchMap(() => {
                return this._lSvc.getToken(this.code).pipe(
                    tapResponse(
                        resp => {
                            lsSetKey('token', resp.access_token)
                            this.getUser();
                            this.getRepo();
                            this.getLanguage();
                        },
                        error => {
                            this._aStore.signOut()
                        }
                    )
                );
            })
        )
    );

    readonly getUser = this.effect($params =>
        $params.pipe(
            switchMap(() => {
                return this._hSvc.getUser().pipe(
                    tapResponse(
                        resp => {
                            this.patchState({ user: resp });
                        },
                        error => {
                            this._aStore.signOut()
                        }
                    )
                );
            })
        )
    );

    readonly getRepo = this.effect($params =>
        $params.pipe(
            tap(() => {
                this.loading = true
            }),
            switchMap(() => {
                return this._hSvc.getRepo(this.pagingRequest).pipe(
                    tapResponse(
                        resp => {
                            this.loading = false;
                            this.isLast = resp.pageSize >= resp.total_count;
                            if (this.isFilter) {
                                this.patchState({ repository: resp });
                                this.isFilter = false;
                            } else {
                                this.onLoadRepo(resp)
                            }
                        },
                        error => {
                            this.loading = false;
                        }
                    )
                );
            })
        )
    );

    readonly getLanguage = this.effect($params =>
        $params.pipe(
            switchMap(() => {
                return this._hSvc.getLanguage().pipe(
                    tapResponse(
                        resp => {
                            this.patchState({ languages: resp });
                        },
                        error => { }
                    )
                );
            })
        )
    );

    onFilterAdvance() {
        this.isFilter = true;
        this.pagingRequest.page = 1;
        this.pagingRequest.created_at = this.pagingRequest.created_at ? moment(this.pagingRequest.created_at).format('YYYY-MM-DD') : '';
        this.getRepo()
    }


    isShowAllField() {
        return this.isShowDate && this.isShowLanguage && this.isShowSize
    }


    onScroll(event: boolean) {
        if (event && !this.isLast && !this.loading) {
            this.pagingRequest.page++
            this.getRepo()
        }
    }

    onLoadRepo = this.updater((state, data: { items: HomeApiModel.repositoryResponse[], pageNumber: number, pageSize: number, total_count: number }) => {
        state.repository.items.push(...data.items);
        state.repository.pageNumber = data.pageNumber;
        state.repository.pageSize = data.pageSize;
        state.repository.total_count = data.total_count;
        return state;
    });
}
