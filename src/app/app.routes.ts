import { Routes } from '@angular/router';

import { onboardingGuard } from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.page')
        .then((m) => m.OnboardingPage),
  },

  {
    path: 'weight',
    canActivate: [onboardingGuard],
    loadComponent: () =>
      import('./features/weight/weight.page')
        .then((m) => m.WeightPage),
  },

  {
    path: 'progress',
    canActivate: [onboardingGuard],
    loadComponent: () =>
      import('./features/progress/progress.page')
        .then((m) => m.ProgressPage),
  },

  {
    path: 'settings',
    canActivate: [onboardingGuard],
    loadComponent: () =>
      import('./features/settings/settings.page')
        .then((m) => m.SettingsPage),
  },

  {
    path: '',
    redirectTo: 'weight',
    pathMatch: 'full',
  },

  {
    path: '**',
    redirectTo: 'weight',
  },
];