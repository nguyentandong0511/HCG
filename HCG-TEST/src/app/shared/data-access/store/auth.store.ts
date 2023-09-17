import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, map, of, pipe, tap, throttleTime } from 'rxjs';
import { Router, RouterStateSnapshot } from '@angular/router';
import { lsGetKey, lsRemoveKey, lsSetKey } from '../../util/helper/local-storage-query';

export interface AuthState { }

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {

    constructor(
        private _router: Router,
    ) {
        super();
    }

    isSignedIn(): Observable<boolean> {
        return of(lsGetKey('token') ? true : false);
    }


    authGuard(state: RouterStateSnapshot) {
        const code = (state as any)['queryParams']['code']
        return this.isSignedIn().pipe(
            map(isSignedIn => {
                if (isSignedIn || !!code) return true;
                return this._router.navigate(['/login']);
            })
        );
    }

    signIn(accessToken: string) {
        lsSetKey('token', accessToken);
        this._router.navigate(['/']);
    }

    readonly signOut = this.effect<never>(
        pipe(
            throttleTime(1000),
            tap(() => {
                lsRemoveKey('token')
                void this._router.navigate(['/login']);
            })
        )
    );

}
