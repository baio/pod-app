import { NgModule } from '@angular/core';
import { DataListComponent } from './data-list/data-list.component';
import { DataRoutingModule } from './data-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    DataRoutingModule,
    NzTableModule,
    CommonModule,
    NzDividerModule,
    HttpClientModule,
    NzDropDownModule,
    FormsModule,
    NzModalModule
  ],
  declarations: [DataListComponent],
  exports: [DataListComponent],
  providers: [DataService],
})
export class DataModule {}
