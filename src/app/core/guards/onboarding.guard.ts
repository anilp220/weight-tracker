import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { GoalStore } from '../services/goal.store';

export const onboardingGuard: CanActivateFn = async () => {
  const goalStore = inject(GoalStore);
  const router = inject(Router);

  await goalStore.load();

  if (goalStore.goal()) {
    return true;
  }

  return router.createUrlTree(['/onboarding']);
};