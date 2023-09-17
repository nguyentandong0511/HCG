import { Route, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { LayoutComponent } from '../ui/component/layout.component';
import { AuthStore } from 'src/app/shared/data-access/store/auth.store';

export const shellRoutes: Route[] = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [(state: RouterStateSnapshot) => inject(AuthStore).authGuard(state)],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'home'
            },
            {
                path: 'home',
                loadChildren: () => import('../../+home/home.routes'),
            },
        ],
    },
    {
        path: 'login',
        canActivate: [() => inject(AuthStore).isSignedIn().pipe(map(iSi => !iSi))],
        loadComponent: () => import('../../+auth/ui/login.component').then(m => m.LoginComponent),
    },
    {
        path: '**',
        loadComponent: () => import('../../shared/ui/component/not-found-route.component').then(m => m.NotFoundRouteComponent),
    },
];
