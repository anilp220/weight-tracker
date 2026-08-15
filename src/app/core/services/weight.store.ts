import { Inject, Injectable, computed, signal } from '@angular/core';

import { WeightEntry } from '../models/weight-entry.model';
import { WeightRepository } from '../repositories/weight.repository';
import { WEIGHT_REPOSITORY } from '../repositories/repository.tokens';

@Injectable({
  providedIn: 'root',
})
export class WeightStore {

  private readonly _entries = signal<WeightEntry[]>([]);
  private readonly _loading = signal(false);

  readonly entries = this._entries.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly latestWeight = computed(() => {
    const entries = this._entries();

    if (entries.length === 0) {
      return null;
    }

    return entries[0];
  });

  constructor(
    @Inject(WEIGHT_REPOSITORY)
    private readonly repository: WeightRepository
  ) {}

  async load(): Promise<void> {
    this._loading.set(true);

    try {
      const entries = await this.repository.getAll();
      this._entries.set(
        this.sortEntries(entries)
      );
    } finally {
      this._loading.set(false);
    }
  }

  async saveWeight(
    weight: number,
    date: string
  ): Promise<void> {

    const existing = await this.repository.getByDate(date);

    if (existing) {
      const updated: WeightEntry = {
        ...existing,
        weight,
        updatedAt: new Date().toISOString(),
      };

      await this.repository.update(updated);
    } else {
      const now = new Date().toISOString();

      const entry: WeightEntry = {
        id: crypto.randomUUID(),
        date,
        weight,
        createdAt: now,
        updatedAt: now,
      };

      await this.repository.save(entry);
    }

    await this.load();
  }

  async deleteWeight(id: string): Promise<void> {
    await this.repository.delete(id);
    await this.load();
  }

  private sortEntries(
    entries: WeightEntry[]
  ): WeightEntry[] {
    return [...entries].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
  }
}