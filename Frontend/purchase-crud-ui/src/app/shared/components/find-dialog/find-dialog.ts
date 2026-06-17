import {FormsModule} from '@angular/forms';

import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import {AgGridAngular} from 'ag-grid-angular';

import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule
} from 'ag-grid-community';


import { LookupService } from '../../../services/lookupService';

import {ChangeDetectorRef} from '@angular/core';

import { Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged
} from 'rxjs/operators';
import { CommonModule } from '@angular/common';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-find-dialog',
  standalone: true,
  imports: [AgGridAngular, FormsModule, CommonModule],
  templateUrl: './find-dialog.html',
  styleUrl: './find-dialog.css'
})
export class FindDialogComponent 
{    
    constructor(private lookupService: LookupService, private cdr: ChangeDetectorRef) {
    }

    private searchSubject = new Subject<{ tableName: string, filters: any }>();

  rowData: any[] = [];
  columnDefs: ColDef[] = [];
  searchFilters: any = {};

    ngOnInit()
    {
        this.loadData();

        this.searchSubject
            .pipe(
                debounceTime(500)
            )
            .subscribe(filters =>
            {
                this.performSearch(
                    filters
                );
            });
    }

    defaultColDef: ColDef = {
        flex: 1,

        minWidth: 120,

        sortable: true,

        resizable: true
    };
  
    loadData(): void
    {

        this.lookupService
            .getLookupData(
                this.tableName)
            .subscribe({

                next: (response) =>
                {
                    this.rowData = [...response];

                    this.generateColumns();

                    this.cdr.detectChanges();

                },

                error: (error) =>
                {
                    console.error(error);
                }
            });
    }

    generateColumns(): void
    {

        if (
            !this.rowData ||
            this.rowData.length === 0
        )
        {
            return;
        }

        const firstRow =
            this.rowData[0];

        this.columnDefs =
            Object.keys(firstRow)
            .map(column =>
            ({
                field: column,

                headerName:
                    column
                    .replace(/([A-Z])/g, ' $1')
                    .trim(),

            valueFormatter:
                column.toLowerCase().includes('date')
                ? (params: any) =>
                {
                    if (!params.value)
                    {
                        return '';
                    }

                    return new Date(
                        params.value
                    )
                    .toLocaleDateString(
                        'en-GB'
                    );
                }
                : undefined

            }));
    }


    @Input()
    title: string = '';

    @Input()
    tableName: string = '';

    @Output()
    rowSelected =
        new EventEmitter<any>();

    @Output()
    dialogClosed =
        new EventEmitter<void>();

    selectRow(row: any): void
    {
        this.rowSelected.emit(row);
    }

    close(): void
    {
        this.dialogClosed.emit();
    }

    onRowDoubleClick(event: any): void
    {
        this.rowSelected.emit(
            event.data
        );

        this.close();
    }

    performSearch(
        filters: any): void
    {
        this.lookupService
            .searchLookup(
                this.tableName,
                filters
            )
            .subscribe({

                next: (response) =>
                {
                    this.rowData = [...response];

                    this.cdr.detectChanges();
                },

                error: (error) =>
                {
                    console.error(
                        error
                    );
                }
            });
    }

    onSearchChanged(): void
    {
        const filters: any = {};

        Object.keys(this.searchFilters)
            .forEach(key =>
            {
                const value =
                    this.searchFilters[key];

                if (
                    value &&
                    value.toString().trim()
                )
                {
                    filters[key] =
                        value.toString();
                }
            });

        if (Object.keys(filters).length === 0)
        {
            this.loadData();

            return;
        }

        this.searchSubject.next(
            filters
        );
    }

}