import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';

import { Subject, takeUntil, tap } from 'rxjs';

import { DiffFormValue, DiffType } from './diff-form.model';

@Component({
  selector: 'compare-images-diff-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './diff-form.component.html',
  styleUrls: ['./diff-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffFormComponent implements OnInit, OnDestroy {
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    type: this.formBuilder.control<DiffType>('rgb'),
    value: this.formBuilder.control<number>(0),
  });

  private destroySubject = new Subject<void>();

  ngOnInit(): void {
    this.typeControl.valueChanges
      .pipe(
        takeUntil(this.destroySubject),
        tap(() => {
          this.valueControl.setValue(0);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }

  get typeControl(): FormControl<DiffType> {
    return this.form.controls.type;
  }

  get valueControl(): FormControl<number> {
    return this.form.controls.value;
  }

  get formValue(): DiffFormValue {
    return this.form.value as DiffFormValue;
  }
}
