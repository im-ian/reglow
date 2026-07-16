import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { REGLOW_FORM_DIRECTIVES } from '@reglow/angular';
import type { RgPressDetail, RgSelectOption } from '@reglow/elements';

interface LaunchDraft {
  readonly projectName: string;
  readonly region: string;
  readonly isPrivate: boolean;
  readonly confidence: number;
}

const initialDraft: LaunchDraft = {
  projectName: 'Northstar Field Notes',
  region: 'iceland',
  isPrivate: true,
  confidence: 4,
};

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, ...REGLOW_FORM_DIRECTIVES],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly #destroyRef = inject(DestroyRef);

  readonly regions: readonly RgSelectOption[] = [
    { value: 'iceland', label: 'Iceland · North Atlantic' },
    { value: 'seoul', label: 'Seoul · Asia Pacific' },
    { value: 'montreal', label: 'Montréal · North America' },
    { value: 'lisbon', label: 'Lisbon · Western Europe' },
  ];

  readonly launchForm = new FormGroup({
    projectName: new FormControl(initialDraft.projectName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    region: new FormControl(initialDraft.region, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isPrivate: new FormControl(initialDraft.isPrivate, { nonNullable: true }),
    confidence: new FormControl(initialDraft.confidence, {
      nonNullable: true,
      validators: [Validators.min(1), Validators.max(5)],
    }),
  });

  readonly draft = signal<LaunchDraft>(initialDraft);
  readonly pressCount = signal(0);
  readonly status = signal('Draft synced locally · waiting for your launch signal.');
  readonly regionLabel = computed(
    () => this.regions.find(({ value }) => value === this.draft().region)?.label ?? 'Unassigned',
  );
  readonly visibility = computed(() => (this.draft().isPrivate ? 'Invite only' : 'Open studio'));
  readonly readiness = computed(() => this.draft().confidence * 20);

  constructor() {
    this.launchForm.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.draft.set(this.launchForm.getRawValue());
      this.status.set('Preview updated · launch settings are not submitted yet.');
    });
  }

  handleLaunchPress(event: Event): void {
    const pressEvent = event as CustomEvent<RgPressDetail>;
    if (pressEvent.defaultPrevented) return;

    this.pressCount.update((count) => count + 1);
    this.status.set(`rg-press #${this.pressCount()} received · validating the Angular form…`);
  }

  submitLaunch(): void {
    if (this.launchForm.invalid) {
      this.launchForm.markAllAsTouched();
      this.status.set('Launch paused · give the project a name and readiness rating.');
      return;
    }

    const { projectName } = this.launchForm.getRawValue();
    this.status.set(
      `rg-press #${this.pressCount()} → ngSubmit · “${projectName}” is queued for review.`,
    );
  }

  resetDraft(event: Event): void {
    const pressEvent = event as CustomEvent<RgPressDetail>;
    if (pressEvent.defaultPrevented) return;

    this.launchForm.reset(initialDraft);
    this.draft.set(initialDraft);
    this.status.set('Draft restored to the Northstar baseline.');
  }
}
