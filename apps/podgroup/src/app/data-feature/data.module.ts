import { NgModule } from '@angular/core';
import { DataListComponent } from './data-list/data-list.component';
import { DataRoutingModule } from './data-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataEditItemComponent } from './data-edit-item/data-edit-item.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NgBytesPipeModule } from '../shared/bytes.pipe';

@NgModule({
  imports: [
    DataRoutingModule,
    NzTableModule,
    CommonModule,
    NzDividerModule,
    HttpClientModule,
    NzDropDownModule,
    FormsModule,
    NzModalModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzInputNumberModule,
    NzButtonModule,
    NgBytesPipeModule,
  ],
  declarations: [DataListComponent, DataEditItemComponent],
  exports: [DataListComponent],
  providers: [DataService],
})
export class DataModule {}
