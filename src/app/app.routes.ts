import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/weight/weight.page').then((m) => m.WeightPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'weight',
    loadComponent: () => import('./features/weight/weight.page').then( m => m.WeightPage)
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress.page').then( m => m.ProgressPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./features/onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
];
