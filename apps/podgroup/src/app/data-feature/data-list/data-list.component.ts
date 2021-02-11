import { Component, OnInit } from '@angular/core';
import {
  DataListOrder,
  DataListRequestDto,
  DataListResponseDto,
  IDataListRequestDto,
} from '@podgroup/api-interfaces';
import { Observable, Subject } from 'rxjs';
import { DataService } from '../data.service';
import { map, switchMap, startWith, tap } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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
  private readonly reload$ = new Subject<IDataListRequestDto | null>();
  readonly view$: Observable<TableView>;

  constructor(private readonly dataService: DataService) {
    const reload$ = this.reload$.pipe(
      switchMap((request) => dataService.loadList(request))
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
    const prms: IDataListRequestDto = {
      page: params.pageIndex,
      limit: params.pageSize,
      sort: sort
        ? (`${sort.value === 'ascend' ? '' : '-'}${sort.key}` as DataListOrder)
        : undefined,
    };
    this.reload$.next(prms);
  }
}
