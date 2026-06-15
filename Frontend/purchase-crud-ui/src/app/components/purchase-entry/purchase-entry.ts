import { Component, HostListener } from '@angular/core';
import { PurchaseService } from '../../services/purchaseService';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  SortChangedEvent
} from 'ag-grid-community';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { PurchaseDetailModel } from '../../models/purchase.detail.model';

import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { ChangeDetectorRef } from '@angular/core';
import { PurchaseCreateModel } from '../../models/purchase.create.model';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-purchase-entry',
  standalone: true,
  imports: [AgGridAngular, FormsModule],
  templateUrl: './purchase-entry.html',
  styleUrl: './purchase-entry.css',
})
export class PurchaseEntry {

  nextInwardNo: number = 0;
  chalanNo: number = 0;
  pDate: string = new Date().toISOString().split('T')[0];
  maxDate: string = new Date().toISOString().split('T')[0];
  partyName: string = '';
  terms: number = 0;
  remarks: string = '';
  purchaseBy: string = '';

  totalAmount: number = 0;
  discountPercent: number = 0;
  extraCost: number = 0;
  netAmount: number = 0;
  purchaseItems: PurchaseDetailModel[] = [];
  rowData: PurchaseDetailModel[] = [];

  detailItem: PurchaseDetailModel = {
  ItemName: '',
  SubParts: '',
  Quantity: 0,
  Rate: 0,
  CGST: 0,
  SGST: 0,
  SerTax: 0,
  Amount: 0,
  Remarks: ''
};

  isEditMode: boolean = false;
  editingRowIndex: number = -1;


  constructor(
    private purchaseService: PurchaseService,
    private cdRef: ChangeDetectorRef
  ){  }

  ngOnInit(): void
  {
    this.loadNextInwardNo();
  }

    columnDefs: ColDef[] = [
      { field: 'ItemName', headerName: 'Item Name' },
      { field: 'SubParts', headerName: 'Sub Parts' },
      { field: 'Quantity', headerName: 'Quantity' },
      { field: 'Rate', headerName: 'Rate' },
      { field: 'CGST', headerName: 'CGST(%)' },
      { field: 'SGST', headerName: 'SGST(%)' },
      {field: 'SerTax', headerName: 'SerTax(%)' },
      { field: 'Amount', headerName: 'Amount' },
      { field: 'Remarks', headerName: 'Remarks' },  
    ];

  calculateAmount(): void
  {
      const qty = Number(this.detailItem.Quantity) || 0;

      const rate = Number(this.detailItem.Rate) || 0;

      const cgst = Number(this.detailItem.CGST) || 0;

      const sgst = Number(this.detailItem.SGST) || 0;

      const serTax = Number(this.detailItem.SerTax) || 0;

      const baseAmount = qty * rate;

      const taxPercent =
          cgst + sgst + serTax;

      const taxAmount =
          (baseAmount * taxPercent) / 100;

      this.detailItem.Amount =
          Number((baseAmount + taxAmount).toFixed(3));
  }

  calculateTotalAmount(): void
  {
      this.totalAmount =
          this.purchaseItems.reduce(
              (sum, item) => sum + item.Amount,
              0
          );

      this.totalAmount =
          Number(this.totalAmount.toFixed(3));

      this.calculateNetAmount();
  }

  calculateNetAmount(): void
  {
      const discount =
          Number(this.discountPercent) || 0;

      const extra =
          Number(this.extraCost) || 0;

      const discountAmount =
          (this.totalAmount * discount) / 100;

      this.netAmount =
          Number(
              (
                  this.totalAmount
                  - discountAmount
                  + extra
              ).toFixed(3)
          );
  }

  addItem(): void
  {
    const itemToAdd: PurchaseDetailModel =
    {
      ...this.detailItem
    };

    if (!this.detailItem.ItemName)
    {
        alert('Please select Item');
        return;
    }

    if (this.detailItem.Quantity <= 0)
    {
        alert('Quantity must be greater than zero');
        return;
    }

    if (this.detailItem.Rate <= 0)
    {
        alert('Rate must be greater than zero');
        return;
    }


    if (this.isEditMode)
    {
        this.purchaseItems[
            this.editingRowIndex
        ] = itemToAdd;

        this.isEditMode = false;

        this.editingRowIndex = -1;
    }
    else
    {
        this.purchaseItems.push(itemToAdd);
    }

    this.calculateTotalAmount();

    this.rowData = [...this.purchaseItems];

    this.clearDetailForm();
  }

  onRowDoubleClick(event: any): void
  {
      this.detailItem =
      {
          ...event.data
      };

      this.editingRowIndex =
          event.rowIndex;

      this.isEditMode = true;
  }

  @HostListener('document:keydown.delete')
  onDeleteKeyPressed(): void
  {
      this.deleteSelectedRow();
  }

  deleteSelectedRow(): void
  {
      if (this.editingRowIndex < 0)
      {
          alert('Please select a row to delete');
          return;
      }

      this.purchaseItems.splice(
          this.editingRowIndex,
          1
      );

      this.rowData = [...this.purchaseItems];

      this.calculateTotalAmount();

      this.clearDetailForm();
  } 

  clearDetailForm(): void
  {
    this.detailItem = {
      ItemName: '',
      SubParts: '',
      Quantity: 0,
      Rate: 0,
      CGST: 0,
      SGST: 0,
      SerTax: 0,
      Amount: 0,
      Remarks: ''
    };

      this.isEditMode = false;
      this.editingRowIndex = -1;
  }

  savePurchase(): void
    {
        // ========================================
        // Master Validations
        // ========================================

        if (this.nextInwardNo <= 0)
        {
            alert('Invalid Inward Number');
            return;
        }

        if (this.chalanNo <= 0)
        {
            alert('Please enter Chalan No');
            return;
        }

        if (!this.pDate)
        {
            alert('Please select Purchase Date');
            return;
        }

        if (this.terms <= 0)
        {
            alert('Terms cannot be zero or negative');
            return;
        }

        // ========================================
        // Detail Validation
        // ========================================

        if (this.purchaseItems.length === 0)
        {
            alert('Please add at least one item');
            return;
        }

        // ========================================
        // Totals Validation
        // ========================================

        if (this.totalAmount <= 0)
        {
            alert('Total Amount must be greater than zero');
            return;
        }

        if (this.netAmount <= 0)
        {
            alert('Net Amount must be greater than zero');
            return;
        }

        // ========================================
        // Create Payload
        // ========================================

        const payload : PurchaseCreateModel =
        {
            inwardNo: this.nextInwardNo,

            chalanNo: this.chalanNo,

            pDate: this.pDate,

            partyName: this.partyName,

            terms: this.terms,

            remarks: this.remarks,

            purchaseBy: this.purchaseBy,

            totalAmount: this.totalAmount,

            discountPercent: this.discountPercent,

            extraCost: this.extraCost,

            netAmount: this.netAmount,

            items: this.purchaseItems
        };

        // ========================================
        // API Call
        // ========================================

        this.purchaseService
          .SavePurchase(payload)
          .subscribe({

              next: (response) =>
              {
                  if (response.success)
                  {
                      alert(response.message);

                      this.resetPurchaseScreen();

                      this.loadNextInwardNo();

                      this.cdRef.detectChanges();
                  }
                  else
                  {
                      alert(response.message);
                  }
              },

              error: (error) =>
              {
                  console.error('Save Error:', error);

                  if (error.error?.message)
                  {
                      alert(error.error.message);
                  }
                  else
                  {
                      alert('Error while saving purchase, Please check the input data and try again.');
                  }
              }
          });
    }

    resetPurchaseScreen(): void
    {
        this.chalanNo = 0;
        this.pDate = new Date().toISOString().split('T')[0];
        this.partyName = '';
        this.terms = 0;
        this.remarks = '';
        this.purchaseBy = '';

        this.totalAmount = 0;
        this.discountPercent = 0;
        this.extraCost = 0;
        this.netAmount = 0;

        this.purchaseItems = [];
        this.rowData = [];

        this.clearDetailForm();
    }

    loadNextInwardNo(): void
    {
        this.purchaseService
            .GetNextInwardNo()
            .subscribe({

                next: (response) =>
                {
                    this.nextInwardNo =
                        response.nextInwardNo;
                    this.cdRef.detectChanges();
                },

                error: (error) =>
                {
                    console.error(
                        'Error fetching inward number',
                        error
                    );
                }
            });
    }

}
