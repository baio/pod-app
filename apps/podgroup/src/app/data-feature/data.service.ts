import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import {
  Data,
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
    return this.http.get<DataListResponseDto>(`${this.baseUrl}api/data`, {
      params: request as any,
    });
  }

  createItem(data: Data) {
    return this.http.post(`${this.baseUrl}api/data`, data);
  }

  updateItem(id: string, data: Data) {
    return this.http.put(`${this.baseUrl}api/data/${id}`, data);
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.baseUrl}api/data/${id}`);
  }
}
