import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import {
  DataListRequestDto,
  DataListResponseDto,
} from '@podgroup/api-interfaces';

// Usually add base url done with interceptor, but here we had only single api
export const API_BASE_URL = new InjectionToken('API_BASE_URL');

@Injectable()
export class DataService {
  constructor(
    private readonly http: HttpClient,
    @Optional() @Inject(API_BASE_URL) private readonly baseUrl?: string
  ) {}

  loadList(request?: DataListRequestDto | null) {
    const params = new HttpParams()
      .set('page', request?.page?.toString())
      .set('limit', request?.limit?.toString())
      .set('sort', request.sort);
    return this.http.get<DataListResponseDto>(`${this.baseUrl}api/data`, {
      params,
    });
  }
}
