import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { GoalStore } from '../../core/services/goal.store';
import { GoalEditorComponent } from '../goal-editor/goal-editor.component';
import { WeightGoal } from '../../core/models/weight-goal.model';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    IonicModule,
    GoalEditorComponent,
  ],
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage {

  constructor(
    private readonly goalStore: GoalStore,
    private readonly router: Router
  ) {}

  async saveGoal(goal: WeightGoal): Promise<void> {
    await this.goalStore.save(goal);

    await this.router.navigateByUrl(
      '/weight',
      { replaceUrl: true }
    );
  }
}