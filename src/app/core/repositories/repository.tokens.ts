import { InjectionToken } from '@angular/core';
import { WeightRepository } from './weight.repository';

export const WEIGHT_REPOSITORY =
  new InjectionToken<WeightRepository>('WEIGHT_REPOSITORY');