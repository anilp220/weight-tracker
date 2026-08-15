import {
  Component,
  OnInit,
} from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { GoalStore } from '../../core/services/goal.store';
import { GoalEditorComponent } from '../goal-editor/goal-editor.component';
import { WeightGoal } from '../../core/models/weight-goal.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IonicModule,
    GoalEditorComponent,
  ],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  goal = this.goalStore.goal;

  constructor(
    private readonly goalStore: GoalStore,
    private readonly router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.goalStore.load();
  }

  async saveGoal(goal: WeightGoal): Promise<void> {
    await this.goalStore.save(goal);

    await this.router.navigateByUrl(
      '/settings',
      { replaceUrl: true }
    );
  }
}