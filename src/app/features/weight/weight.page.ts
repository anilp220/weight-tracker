import {Component, OnInit, computed, signal} from '@angular/core';
import {IonicModule} from '@ionic/angular';

import {WeightStore} from '../../core/services/weight.store';
import { DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-weight',
  templateUrl: './weight.page.html',
  styleUrls: ['./weight.page.scss'],
  standalone: true,
  imports: [IonicModule,DecimalPipe],
})
export class WeightPage implements OnInit {

  readonly weight = signal(68.4);

  readonly formattedWeight = computed(() =>
    this.weight().toFixed(1)
  );
  readonly startingWeight = 72;
  readonly targetWeight = 65;

  readonly weightLost = computed(() =>
    Math.max(
      0,
      this.startingWeight - this.weight()
    ).toFixed(1)
  );

  readonly weightRemaining = computed(() =>
    Math.max(
      0,
      this.weight() - this.targetWeight
    ).toFixed(1)
  );

  readonly progressPercent = computed(() => {
    const total =
      this.startingWeight - this.targetWeight;

    if (total <= 0) {
      return 0;
    }

    const lost =
      this.startingWeight - this.weight();

    return Math.min(
      100,
      Math.max(
        0,
        (lost / total) * 100
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
    private readonly weightStore: WeightStore
  ) { }

  async ngOnInit(): Promise<void> {
    await this.weightStore.load();

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