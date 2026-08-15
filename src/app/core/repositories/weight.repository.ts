import {WeightEntry} from '../models/weight-entry.model';

export interface WeightRepository {
    getAll(): Promise<WeightEntry[]>;
    getById(id: string): Promise<WeightEntry | null>;
    getByDate(date: string): Promise<WeightEntry | null>;
    save(entry: WeightEntry): Promise<void>;
    update(entry: WeightEntry): Promise<void>;
    delete(id: string): Promise<void>;
}