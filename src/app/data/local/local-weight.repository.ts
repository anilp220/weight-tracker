import {Injectable} from '@angular/core';

import {WeightEntry} from '../../core/models/weight-entry.model';
import {WeightRepository} from '../../core/repositories/weight.repository';
import {STORAGE_KEYS} from '../../core/constants/app.constants';
import {LocalStorageService} from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class LocalWeightRepository implements WeightRepository {

    constructor(
        private readonly storage: LocalStorageService
    ) { }

    async getAll(): Promise<WeightEntry[]> {
        return (
            await this.storage.get<WeightEntry[]>(
                STORAGE_KEYS.WEIGHT_ENTRIES
            )
        ) ?? [];
    }

    async getById(id: string): Promise<WeightEntry | null> {
        const entries = await this.getAll();

        return entries.find(entry => entry.id === id) ?? null;
    }

    async getByDate(date: string): Promise<WeightEntry | null> {
        const entries = await this.getAll();

        return entries.find(entry => entry.date === date) ?? null;
    }

    async save(entry: WeightEntry): Promise<void> {
        const entries = await this.getAll();

        entries.push(entry);

        await this.storage.set(
            STORAGE_KEYS.WEIGHT_ENTRIES,
            entries
        );
    }

    async update(entry: WeightEntry): Promise<void> {
        const entries = await this.getAll();

        const index = entries.findIndex(
            existing => existing.id === entry.id
        );

        if (index === -1) {
            throw new Error('Weight entry not found');
        }

        entries[index] = entry;

        await this.storage.set(
            STORAGE_KEYS.WEIGHT_ENTRIES,
            entries
        );
    }

    async delete(id: string): Promise<void> {
        const entries = await this.getAll();

        const filtered = entries.filter(
            entry => entry.id !== id
        );

        await this.storage.set(
            STORAGE_KEYS.WEIGHT_ENTRIES,
            filtered
        );
    }
}