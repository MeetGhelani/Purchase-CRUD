import { Component } from '@angular/core';
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

  private readonly STORAGE_KEY = 'purchase-draft';

  nextInwardNo: number = 0;
  purchaseItems: PurchaseDetailModel[] = [];
  rowData: PurchaseDetailModel[] = [];

  chalanNo: number = 0;
  pDate: Date = new Date();
  partyName: string = '';
  terms: number = 0;
  remarks: string = '';
  purchaseBy: string = '';

  totalAmount: number = 0;
  discountPercent: number = 0;
  extraCost: number = 0;
  netAmount: number = 0;
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

  constructor(
    private purchaseService: PurchaseService,
  ){}

  ngOnInit(): void
  {
    console.log('Fetching next inward number...');
    this.purchaseService
        .GetNextInwardNo()
        .subscribe({
          next: (response) => {
            console.log('Next inward number:', response.nextInwardNo);
            this.nextInwardNo = response.nextInwardNo;
          },
          error: (error) => {
            console.error('Error fetching next inward number:', error);
          }
        });

      this.loadDraft();
  }

saveDraft(): void
{
  const draft =
  {
    master:
    {
      inwardNo: this.nextInwardNo,
      chalanNo: this.chalanNo,
      pDate: this.pDate,
      partyName: this.partyName,
      terms: this.terms,
      remarks: this.remarks,
      purchaseBy: this.purchaseBy
    },

    items: this.purchaseItems,

    totals:
    {
      totalAmount: this.totalAmount,
      discountPercent: this.discountPercent,
      extraCost: this.extraCost,
      netAmount: this.netAmount
    }
  };

  localStorage.setItem(
    'purchase-draft',
    JSON.stringify(draft)
  );
}

loadDraft(): void
{
  const draftJson =
    localStorage.getItem('purchase-draft');

  if (!draftJson)
  {
    return;
  }

  const draft = JSON.parse(draftJson);

  // Master

  this.nextInwardNo = draft.master.inwardNo;
  this.chalanNo = draft.master.chalanNo;
  this.pDate = new Date(draft.master.pDate);
  this.partyName = draft.master.partyName;
  this.terms = draft.master.terms;
  this.remarks = draft.master.remarks;
  this.purchaseBy = draft.master.purchaseBy;

  // Details

  this.purchaseItems = draft.items || [];
  this.rowData = [...this.purchaseItems];

  // Totals

  this.totalAmount = draft.totals.totalAmount;
  this.discountPercent = draft.totals.discountPercent;
  this.extraCost = draft.totals.extraCost;
  this.netAmount = draft.totals.netAmount;
}

  addItem(): void
  {
    const itemToAdd: PurchaseDetailModel =
    {
      ...this.detailItem
    };

    this.purchaseItems.push(itemToAdd);

    this.saveDraft();

    this.rowData = [...this.purchaseItems];

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

        const payload =
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

        console.log('Payload Being Sent');
        console.log(payload);

        // ========================================
        // API Call
        // ========================================

       /* this.purchaseService
            .SavePurchase(payload)
            .subscribe({

                next: (response) =>
                {
                    console.log(response);

                    if (response.success)
                    {
                        alert(response.message);

                        // Clear Draft
                        localStorage.removeItem('purchase-draft');

                        // Reset Screen
                        this.resetPurchaseScreen();

                        // Get New Inward No
                        this.loadNextInwardNo();
                    }
                    else
                    {
                        alert(response.message);
                    }
                },

                error: (error) =>
                {
                    console.error(error);

                    alert('Error while saving purchase');
                }
            });*/
    }

    resetPurchaseScreen(): void
    {
        this.chalanNo = 0;
        this.pDate = new Date();
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

    loadNextInwardNo(): void{

    }

}
