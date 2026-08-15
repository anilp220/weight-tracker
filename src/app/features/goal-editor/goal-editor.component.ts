import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    signal,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {WeightGoal} from '../../core/models/weight-goal.model';

@Component({
    selector: 'app-goal-editor',
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
    ],
    templateUrl: './goal-editor.component.html',
    styleUrls: ['./goal-editor.component.scss'],
})
export class GoalEditorComponent implements OnInit {

    @Input() goal: WeightGoal | null = null;

    @Input() buttonLabel = 'SAVE GOAL';

    @Output() saved = new EventEmitter<WeightGoal>();

    readonly startingWeight = signal(0);
    readonly targetWeight = signal(0);
    readonly targetDate = signal('');

    readonly error = signal('');

    ngOnInit(): void {
        if (!this.goal) {
            return;
        }

        this.startingWeight.set(
            this.goal.startingWeight
        );

        this.targetWeight.set(
            this.goal.targetWeight
        );

        this.targetDate.set(
            this.goal.targetDate ?? ''
        );
    }

    submit(): void {
        const startingWeight = this.startingWeight();
        const targetWeight = this.targetWeight();
        const targetDate = this.targetDate();

        if (startingWeight <= 0) {
            this.error.set(
                'Enter a valid starting weight.'
            );
            return;
        }

        if (targetWeight <= 0) {
            this.error.set(
                'Enter a valid target weight.'
            );
            return;
        }

        if (targetDate) {
            const today = this.getLocalDate();

            if (targetDate < today) {
                this.error.set(
                    'Target date cannot be in the past.'
                );
                return;
            }
        }

        this.error.set('');

        this.saved.emit({
            startingWeight,
            targetWeight,
            targetDate: targetDate || undefined,
        });
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