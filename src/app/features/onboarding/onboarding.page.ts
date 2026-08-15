import {Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {GoalStore} from '../../core/services/goal.store';
import {Router} from '@angular/router';

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
    private readonly goalStore: GoalStore,
    private readonly router: Router
  ) { }

  async saveGoal(): Promise<void> {

    await this.goalStore.save({
      startingWeight: this.startingWeight(),
      targetWeight: this.targetWeight(),
      targetDate: this.targetDate() || undefined,
    });

    await this.router.navigateByUrl('/weight', {
      replaceUrl: true,
    });
  }
}