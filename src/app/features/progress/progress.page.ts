import {
  Component,
  OnInit,
  computed,
  signal,
} from '@angular/core';

import {
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { WeightStore } from '../../core/services/weight.store';
import { GoalStore } from '../../core/services/goal.store';
import { WeightEntry } from '../../core/models/weight-entry.model';

type ProgressFilter = 'week' | 'month' | 'full';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    DecimalPipe,
    DatePipe
  ],
})
export class ProgressPage implements OnInit {

  readonly filter = signal<ProgressFilter>('week');
readonly Math = Math;
  readonly entries = computed(() =>
    this.getFilteredEntries(
      this.weightStore.entries(),
      this.filter()
    )
  );

  readonly currentWeight = computed(() => {
    return this.weightStore.latestWeight()?.weight ?? null;
  });

  readonly startingWeight = computed(() =>
    this.goalStore.goal()?.startingWeight ?? 0
  );

  readonly targetWeight = computed(() =>
    this.goalStore.goal()?.targetWeight ?? 0
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

  readonly totalChange = computed(() => {
    const current = this.currentWeight();

    if (current === null) {
      return 0;
    }

    return Math.abs(
      current - this.startingWeight()
    );
  });

  readonly totalChangeLabel = computed(() => {
    switch (this.goalDirection()) {
      case 'gain':
        return 'gained';

      case 'loss':
        return 'lost';

      default:
        return 'change';
    }
  });

  readonly averageWeight = computed(() => {
    const entries = this.entries();

    if (!entries.length) {
      return 0;
    }

    const total = entries.reduce(
      (sum, entry) => sum + entry.weight,
      0
    );

    return total / entries.length;
  });

  readonly lowestWeight = computed(() => {
    const entries = this.entries();

    if (!entries.length) {
      return 0;
    }

    return Math.min(
      ...entries.map(entry => entry.weight)
    );
  });

  readonly highestWeight = computed(() => {
    const entries = this.entries();

    if (!entries.length) {
      return 0;
    }

    return Math.max(
      ...entries.map(entry => entry.weight)
    );
  });

  readonly periodChange = computed(() => {
    const entries = this.entries();

    if (entries.length < 2) {
      return 0;
    }

    const newest = entries[0].weight;
    const oldest = entries[entries.length - 1].weight;

    return newest - oldest;
  });

  readonly chartPoints = computed(() => {
    const entries = [...this.entries()]
      .sort((a, b) =>
        a.date.localeCompare(b.date)
      );

    if (!entries.length) {
      return '';
    }

    const width = 320;
    const height = 180;
    const padding = 20;

    const weights = entries.map(
      entry => entry.weight
    );

    const min = Math.min(...weights);
    const max = Math.max(...weights);

    const range = max - min || 1;

    return entries
      .map((entry, index) => {

        const x =
          entries.length === 1
            ? width / 2
            : padding +
              (index / (entries.length - 1)) *
              (width - padding * 2);

        const y =
          height -
          padding -
          ((entry.weight - min) / range) *
          (height - padding * 2);

        return `${x},${y}`;
      })
      .join(' ');
  });

  readonly chartDots = computed(() => {
    const entries = [...this.entries()]
      .sort((a, b) =>
        a.date.localeCompare(b.date)
      );

    if (!entries.length) {
      return [];
    }

    const width = 320;
    const height = 180;
    const padding = 20;

    const weights = entries.map(
      entry => entry.weight
    );

    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;

    return entries.map((entry, index) => {

      const x =
        entries.length === 1
          ? width / 2
          : padding +
            (index / (entries.length - 1)) *
            (width - padding * 2);

      const y =
        height -
        padding -
        ((entry.weight - min) / range) *
        (height - padding * 2);

      return {
        x,
        y,
        weight: entry.weight,
      };
    });
  });

  constructor(
    private readonly weightStore: WeightStore,
    private readonly goalStore: GoalStore
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.weightStore.load(),
      this.goalStore.load(),
    ]);
  }

  setFilter(
    filter: ProgressFilter
  ): void {
    this.filter.set(filter);
  }

  trackById(
    _: number,
    entry: WeightEntry
  ): string {
    return entry.id;
  }

  private getFilteredEntries(
    entries: WeightEntry[],
    filter: ProgressFilter
  ): WeightEntry[] {

    if (filter === 'full') {
      return [...entries];
    }

    const days =
      filter === 'week'
        ? 7
        : 30;

    const cutoff = new Date();

    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(
      cutoff.getDate() - (days - 1)
    );

    const cutoffDate =
      this.formatDate(cutoff);

    return entries.filter(
      entry => entry.date >= cutoffDate
    );
  }

  private formatDate(date: Date): string {
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