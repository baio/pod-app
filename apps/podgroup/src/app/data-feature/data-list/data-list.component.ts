import { Component } from '@angular/core';
import {
  Data,
  DataListOrder,
  DataListResponseDto,
  IDataListRequestDto,
} from '@podgroup/api-interfaces';
import { fromPairs, identity, pickBy } from 'lodash/fp';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableComponent, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, scan, startWith, switchMap } from 'rxjs/operators';
import { DataEditItemComponent } from '../data-edit-item/data-edit-item.component';
import { DataService } from '../data.service';

export interface TableStatusInitial {
  kind: 'TableStatusInitial';
}

export interface TableStatusLoading {
  kind: 'TableStatusLoading';
}

export interface TableStatusError {
  kind: 'TableStatusError';
  message: string;
}

export type TableStatus =
  | TableStatusInitial
  | TableStatusLoading
  | TableStatusError;

export interface TableView {
  status: TableStatus;
  list: DataListResponseDto;
}

const defaultView: TableView = {
  status: {
    kind: 'TableStatusInitial',
  },
  list: {
    items: [],
    pager: { limit: 25, page: 1, count: 0 },
  },
};

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent {
  private readonly reload$ = new Subject<
    IDataListRequestDto | null | 'reload'
  >();
  readonly view$: Observable<TableView>;

  filterStatus = [
    { text: 'active', value: 'active' },
    { text: 'preactive', value: 'preactive' },
    { text: 'deactivated', value: 'deactivated' },
    { text: 'suspended', value: 'suspendedfemale' },
  ];

  filterUsageBytes = [
    { text: '0', value: ',0' },
    { text: '> 0', value: '1,' },
    { text: '[1, 50000)', value: '1,49999' },
    { text: '> 50000', value: '50000,' },
  ];

  constructor(
    private readonly dataService: DataService,
    private readonly modalService: NzModalService
  ) {
    const reload$ = this.reload$.pipe(
      scan((acc, curr) => (curr === 'reload' ? acc : curr)),
      switchMap((request: IDataListRequestDto) =>
        dataService.loadList(request).pipe(
          map((response) => ({
            status: { kind: 'TableStatusInitial' as 'TableStatusInitial' },
            list: response,
          })),
          catchError((err) =>
            of({
              status: {
                kind: 'TableStatusError' as 'TableStatusError',
                message: err.error.message,
              },
              list: null,
            })
          ),
          startWith({
            status: { kind: 'TableStatusLoading' as 'TableStatusLoading' },
            list: null,
          })
        )
      ),
      scan(
        (acc, curr) =>
          // If current status doesn't contain list response, substitute it with pervious one, this way guarantee state always has latest list
          curr.list === null ? { ...curr, list: acc.list } : curr,
        defaultView
      )
    );

    this.view$ = reload$.pipe(startWith(defaultView));
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    const sort = params.sort.find((f) => f.value !== null);
    const filters = fromPairs(
      params.filter
        .filter((f) => !!f.value)
        .map((m) => [`filter.${m.key}`, m.value])
    );
    const prms: IDataListRequestDto = {
      page: params.pageIndex,
      limit: params.pageSize,
      sort: sort
        ? (`${sort.value === 'ascend' ? '' : '-'}${sort.key}` as DataListOrder)
        : undefined,
      ...filters,
    };
    const cleanPrms = pickBy(identity, prms);
    this.reload$.next(cleanPrms);
  }

  trackByRow(_, item: Data) {
    return item._id;
  }

  onDelete(item: Data) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Warning',
      nzContent: `You about to delete item subscriberId : ${item.subscriberId}, continue ?`,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Yes',
          danger: true,
          onClick: async () => {
            try {
              await this.dataService.deleteItem(item._id).toPromise();
              this.reload$.next('reload');
              modal.destroy();
            } catch (err) {
              this.modalService.error({
                nzTitle: 'Server error',
                nzContent: err.error.message,
              });
            }
          },
        },
      ],
    });
  }

  onCreate() {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Create new item',
      nzContent: DataEditItemComponent,
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Create',
          type: 'primary',
          disabled: (componentInstance) => componentInstance.form.invalid,
          onClick: async (componentInstance) => {
            try {
              await this.dataService
                .createItem(componentInstance.form.value)
                .toPromise();
              this.reload$.next('reload');
              modal.destroy();
            } catch (err) {
              componentInstance.error = err.error.message;
            }
          },
        },
      ],
    });
  }
}
