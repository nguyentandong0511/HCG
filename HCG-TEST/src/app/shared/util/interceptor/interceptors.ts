import { inject } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';

import { EMPTY, Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthStore } from '../../data-access/store/auth.store';
import { lsGetKey } from '../helper/local-storage-query';

export const SHOW_LOADING = new HttpContextToken<boolean>(() => true);
export const SHOW_API_MESSAGE = new HttpContextToken<boolean>(() => true);

export const interceptors = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authStore = inject(AuthStore);
  // const globalSpinStore = inject(GlobalSpinnerStore);

  const showLoading = req.context.get(SHOW_LOADING);
  const showApiMessage = req.context.get(SHOW_API_MESSAGE);

  const token = lsGetKey('token')
  req = req.clone({
    url: !req.url.includes('http') ? environment.API_DOMAIN + req.url : req.url,
    setHeaders: {
      Authorization: !!token ? `Bearer ${token ? token : ''}` : '',
    },
  });

  // runIf(showLoading, () => globalSpinStore.start());

  return next(req).pipe(
    tap({
      next: response => {
        if (response.type === HttpEventType.Response) {
          if (response && response.body) {

          }
        }
      },
      // finalize: () => runIf(showLoading, () => globalSpinStore.stop()),
    }),
    catchError((error: HttpErrorResponse, _: Observable<HttpEvent<unknown>>) => {
      const apiError = error.error as null;

      if (error.status === HttpStatusCode.Unauthorized) {
        authStore.signOut()
        return EMPTY;
      }

      return throwError(() => apiError);
    })
  );
};

function runIf(isShowMessage: boolean, func: () => void) {
  if (isShowMessage) {
    func();
  }
}

