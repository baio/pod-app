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
import { Observable, Subject } from 'rxjs';
import { map, scan, startWith, switchMap } from 'rxjs/operators';
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
    { text: '0 or empty', value: ',0' },
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
      switchMap((request: IDataListRequestDto) => dataService.loadList(request))
    );

    this.view$ = reload$.pipe(
      map((response) => ({
        status: { kind: 'TableStatusInitial' as 'TableStatusInitial' },
        list: response,
      })),
      startWith(defaultView)
    );
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

  onDelete(item: Data, table: NzTableComponent) {
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
}
