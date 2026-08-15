import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {GoalStore} from '../../core/services/goal.store';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
  ],
})
export class OnboardingPage {

  startingWeight = signal(72);
  targetWeight = signal(65);

  targetDate = signal('');

  constructor(
    private readonly goalStore: GoalStore
  ) { }

  async saveGoal(): Promise<void> {

    await this.goalStore.save({
      startingWeight: this.startingWeight(),
      targetWeight: this.targetWeight(),
      targetDate: this.targetDate() || undefined,
    });

    console.log('Goal saved:', this.goalStore.goal());

    // Navigation will be added next.
  }
}