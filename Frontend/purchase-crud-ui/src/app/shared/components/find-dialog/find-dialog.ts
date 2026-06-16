import {FormsModule} from '@angular/forms';

import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import {AgGridAngular} from 'ag-grid-angular';

import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule
} from 'ag-grid-community';
import { LookupService } from '../../../services/lookupService';

import {ChangeDetectorRef} from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-find-dialog',
  standalone: true,
  imports: [AgGridAngular, FormsModule],
  templateUrl: './find-dialog.html',
  styleUrl: './find-dialog.css'
})
export class FindDialogComponent 
{
    constructor(private lookupService: LookupService, private cdr: ChangeDetectorRef) {
    }

  searchTerm: string = '';
  rowData: any[] = [];
  columnDefs: ColDef[] = [];

    defaultColDef: ColDef =
    {
        flex: 1,
        resizable: true
    };

  ngOnInit() {
    this.loadData();
  }
  
    loadData(): void
    {

        console.log("Table Name:", this.tableName);
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

                sortable: true,

                filter: true,

                floatingFilter: true,

                resizable: true
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

    onFilterChanged(event: any): void
    {
        const filterModel =
            event.api.getFilterModel();

        const filters: any = {};

        Object.keys(filterModel)
            .forEach(key =>
            {
                filters[key] =
                    filterModel[key]
                    .filter;
            });

        console.log(filters);

        this.lookupService
            .searchLookup(
                this.tableName,
                filters
            )
            .subscribe({
                next: (response) =>
                {
                    this.rowData =
                        response;
                }
            });
    }

}