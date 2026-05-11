import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/Layout/main-layout/main-layout.component';
 
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'colaboradores',
        pathMatch: 'full',
      },
      {
        path: 'colaboradores',
        loadChildren: () =>
          import('./features/colaboradores/colaboradores.routes').then(
            m => m.COLABORADORES_ROUTES
          ),
      },
      // Rutas placeholder para el sidebar
      { path: 'dashboard',    loadComponent: () => import('./core/Layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent) },
      { path: 'proyectos',    loadComponent: () => import('./core/Layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent) },
      { path: 'lideres',      loadComponent: () => import('./core/Layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent) },
      { path: 'clientes',     loadComponent: () => import('./core/Layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent) },
      { path: 'time-report',  loadComponent: () => import('./core/Layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent) },
    ],
  },
  { path: '**', redirectTo: 'colaboradores' },
];