import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-edit-item',
  templateUrl: './data-edit-item.component.html',
  styleUrls: ['./data-edit-item.component.scss'],
})
export class DataEditItemComponent {
  @Input() error: string;
  readonly form: FormGroup;
  constructor(fb: FormBuilder) {
    this.form = fb.group({
      subscriberId: ['', Validators.required],
      status: ['active', Validators.required],
      usageBytes: [null],
    });
  }

  onSubmit() {}
}
