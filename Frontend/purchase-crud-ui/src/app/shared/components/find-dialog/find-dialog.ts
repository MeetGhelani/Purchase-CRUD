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

import { LookupServerFilterComponent } from '../lookup-server-filter/lookup-server-filter';
import { LookupFloatingFilterComponent } from '../lookup-floating-filter/lookup-floating-filter';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-find-dialog',
  standalone: true,
  imports: [AgGridAngular, FormsModule ],
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

        filter:true,

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

                        filter: LookupServerFilterComponent,
                        floatingFilter: true,
                        floatingFilterComponent:LookupFloatingFilterComponent,

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

    onFilterChanged(event: any): void
    {
        const filterModel = event.api.getFilterModel();

        const filters: any = {};

        Object.keys(filterModel)
            .forEach(key =>
            {
                const value =
                    filterModel[key]?.value;

                if (
                    value &&
                    value.toString().trim()
                )
                {
                    filters[key] =
                        value.toString();
                }
            });

        if (
            Object.keys(filters).length === 0
        )
        {
            this.loadData();
            return;
        }

        this.searchSubject.next(
            filters
        );
    }

}