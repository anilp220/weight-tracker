import { Injectable } from '@angular/core';

import { GoalStore } from './goal.store';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {

  constructor(
    private readonly goalStore: GoalStore
  ) {}

  async initialize(): Promise<void> {
    await this.goalStore.load();
  }

  hasCompletedOnboarding(): boolean {
    return this.goalStore.goal() !== null;
  }
}