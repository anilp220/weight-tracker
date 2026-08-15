import {Component, OnInit, computed, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {WeightStore} from '../../core/services/weight.store';
import {DecimalPipe} from '@angular/common';
import {GoalStore} from 'src/app/core/services/goal.store';
@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class WeightPage implements OnInit {

  readonly weight = signal(68.4);

  readonly formattedWeight = computed(() =>
    this.weight().toFixed(1)
  );
  readonly goalDirection = computed(() => {
    const starting = this.startingWeight();
    const target = this.targetWeight();

    if (target > starting) {
      return 'gain';
    }

    if (target < starting) {
      return 'loss';
    }

    return 'maintain';
  });
  readonly startingWeight = computed(() =>
    this.goalStore.goal()?.startingWeight ?? 0
  );

  readonly targetWeight = computed(() =>
    this.goalStore.goal()?.targetWeight ?? 0
  );

  readonly weightChange = computed(() => {
    return Math.abs(
      this.weight() - this.startingWeight()
    ).toFixed(1);
  });

  readonly weightRemaining = computed(() => {
    return Math.abs(
      this.targetWeight() - this.weight()
    ).toFixed(1);
  });

  readonly progressPercent = computed(() => {
    const starting = this.startingWeight();
    const target = this.targetWeight();
    const current = this.weight();

    const totalDistance = Math.abs(target - starting);

    if (totalDistance === 0) {
      return 100;
    }

    let completedDistance: number;

    if (target > starting) {
      // Weight gain
      completedDistance = current - starting;
    } else {
      // Weight loss
      completedDistance = starting - current;
    }

    return Math.min(
      100,
      Math.max(
        0,
        (completedDistance / totalDistance) * 100
      )
    );
  });

  readonly formattedDate = new Intl.DateTimeFormat(
    'en-IN',
    {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }
  ).format(new Date());
  constructor(
    private readonly weightStore: WeightStore,
    private readonly goalStore: GoalStore
  ) { }

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.weightStore.load(),
      this.goalStore.load(),
    ]);

    const latest = this.weightStore.latestWeight();

    if (latest) {
      this.weight.set(latest.weight);
    }
  }

  increaseWeight(): void {
    this.weight.update(value =>
      Number((value + 0.1).toFixed(1))
    );
  }

  decreaseWeight(): void {
    this.weight.update(value =>
      Math.max(
        0,
        Number((value - 0.1).toFixed(1))
      )
    );
  }

  async saveWeight(): Promise<void> {
    await this.weightStore.saveWeight(
      this.weight(),
      this.getLocalDate()
    );

    console.log(
      'Saved weight:',
      this.weight()
    );
  }

  private getLocalDate(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}