import {Injectable, signal} from '@angular/core';

import {WeightGoal} from '../models/weight-goal.model';
import {LocalStorageService} from '../../data/local/local-storage.service';
import {STORAGE_KEYS} from '../constants/app.constants';

@Injectable({
    providedIn: 'root',
})
export class GoalStore {
    private readonly _goal = signal<WeightGoal | null>(null);

    readonly goal = this._goal.asReadonly();

    constructor(
        private readonly storage: LocalStorageService
    ) { }

    async load(): Promise<void> {
        const goal = await this.storage.get<WeightGoal>(
            STORAGE_KEYS.WEIGHT_GOAL
        );

        this._goal.set(goal);
    }

    async save(goal: WeightGoal): Promise<void> {
        await this.storage.set(
            STORAGE_KEYS.WEIGHT_GOAL,
            goal
        );

        this._goal.set(goal);
    }

    async clear(): Promise<void> {
        await this.storage.remove(
            STORAGE_KEYS.WEIGHT_GOAL
        );

        this._goal.set(null);
    }
}