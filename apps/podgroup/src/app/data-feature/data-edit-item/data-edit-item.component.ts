import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data } from '@podgroup/api-interfaces';

@Component({
  selector: 'app-data-edit-item',
  templateUrl: './data-edit-item.component.html',
  styleUrls: ['./data-edit-item.component.scss'],
})
export class DataEditItemComponent implements OnInit {
  @Input() error: string;
  @Input() data: Data;
  form: FormGroup;
  constructor(private readonly fb: FormBuilder) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      subscriberId: [this.data?.subscriberId, Validators.required],
      status: [this.data?.status, Validators.required],
      usageBytes: [this.data?.usageBytes],
    });
  }
}
