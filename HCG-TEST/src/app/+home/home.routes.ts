import { Route } from '@angular/router';

const HOME_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./ui/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'detail/:name',
        loadComponent: () => import('./ui/home-detail.component').then(m => m.HomeDetailComponent),
    },
];

export default HOME_ROUTES;
