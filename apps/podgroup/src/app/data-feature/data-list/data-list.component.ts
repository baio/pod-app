import { Component, ViewChild } from '@angular/core';
import {
  Data,
  DataListOrder,
  DataListResponseDto,
  IDataListRequestDto,
} from '@podgroup/api-interfaces';
import { filter } from 'lodash';
import { eq, equals, fromPairs, identity, pickBy } from 'lodash/fp';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableComponent, NzTableQueryParams } from 'ng-zorro-antd/table';
import { Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  map,
  scan,
  startWith,
  switchMap,
} from 'rxjs/operators';
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
    pager: { limit: 30, page: 1, count: 0 },
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

  bytesTo = 'MB';

  filterStatus = [
    { text: 'active', value: 'active' },
    { text: 'preactive', value: 'preactive' },
    { text: 'inactive', value: 'inactive' },
    { text: 'suspended', value: 'suspended' },
  ];

  filterUsageBytes = [
    { text: '0 MB', value: ',0' },
    { text: '< 5 MB', value: '1,5000000' },
    { text: '> 5 MB', value: '5000000,' },
  ];

  constructor(
    private readonly dataService: DataService,
    private readonly modalService: NzModalService,
  ) {
    const reload$ = this.reload$.pipe(
      scan((acc, curr) => {
        if (curr === 'reload') {
          // reload data with pervious parameters
          // hack to always pass distinctUntilChanged bellow
          return {
            ...(acc as IDataListRequestDto),
            __time: new Date().getTime(),
          };
        } else if (curr.page && curr.page !== 1) {
          // if perv filer != current filter or items per page is different reset page to index 1
          if (
            curr['filter.status'] !== acc['filter.status'] ||
            curr['filter.subscriberId'] !== acc['filter.subscriberId'] ||
            curr['filter.usageBytes'] !== acc['filter.usageBytes'] ||
            curr['limit'] !== acc['limit']
          ) {
            return { ...curr, page: 1 };
          }
        }
        return curr;
      }),
      // protect for double reloading when change table meta data during request
      distinctUntilChanged((a, b) => {
        return equals(a, b);
      }),
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
    console.log('onQueryParamsChange', params);
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

  onEdit(data: Data) {
    const modal: NzModalRef = this.modalService.create({
      nzTitle: 'Edit item',
      nzContent: DataEditItemComponent,
      nzComponentParams: {
        data,
      },
      nzFooter: [
        {
          label: 'Cancel',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Update',
          type: 'primary',
          disabled: (componentInstance) => componentInstance.form.invalid,
          onClick: async (componentInstance) => {
            try {
              await this.dataService
                .updateItem(data._id, componentInstance.form.value)
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

  // control table height
  @ViewChild('tableContainer') private readonly _tableContainer!: any;
  public tableHeight!: number;
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.tableHeight =
        (this._tableContainer.nativeElement as HTMLImageElement).clientHeight -
        150; // X depend of your page display
    });
  }
}
