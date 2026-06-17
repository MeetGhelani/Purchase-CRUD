import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';

import { Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LookupService
{
    
    private apiUrl =
        environment.apiBaseUrllookup;

    constructor(
        private http: HttpClient)
    {
    }

    getLookupData(
        tableName: string)
    {
        return this.http.get<any[]>(
            `${this.apiUrl}/${tableName}`
        );
    }

    searchLookup(tableName: string, filters: any)
    {
        return this.http.post<any[]>(
            `${this.apiUrl}/search`,{
                tableName,
                filters
            });
    }
}