import { Component, HostListener } from '@angular/core';
import { PurchaseService } from '../../services/purchaseService';

import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
} from 'ag-grid-community';

import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { PurchaseDetailModel } from '../../models/purchase.detail.model';

import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

import { ChangeDetectorRef } from '@angular/core';
import { PurchaseCreateModel } from '../../models/purchase.create.model';

import{FindDialogComponent} from '../../shared/components/find-dialog/find-dialog';


// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-purchase-entry',
  standalone: true,
  imports: [AgGridAngular, FormsModule, FindDialogComponent],
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

  showFindDialog: boolean = false;
  isEditPurchaseMode: boolean = false;


  constructor(
    private purchaseService: PurchaseService,
    private cdRef: ChangeDetectorRef
  ){  }

  ngOnInit(): void
  {
    this.loadNextInwardNo();
  }

    columnDefs: ColDef[] = [
      { field: 'ItemName', headerName: 'Item Name', width: 200 },
      { field: 'SubParts', headerName: 'Sub Parts',width: 150 },
      { field: 'Quantity', headerName: 'Quantity' ,width: 100},
      { field: 'Rate', headerName: 'Rate', width: 100 },
      { field: 'CGST', headerName: 'CGST(%)' , width: 100},
      { field: 'SGST', headerName: 'SGST(%)' , width: 100},
      {field: 'SerTax', headerName: 'SerTax(%)' , width: 100},
      { field: 'Amount', headerName: 'Amount' , width: 120},
      { field: 'Remarks', headerName: 'Remarks' , width: 200},  
    ];

    openFindDialog(): void
    {
        this.showFindDialog = true;
    }

    closeFindDialog(): void
    {
        this.showFindDialog = false;
    }

    allowThreeDecimals(event: KeyboardEvent): void
    {

        const input = event.target as HTMLInputElement;

        const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'Tab'
        ];

        if (allowedKeys.includes(event.key))
        {
            return;
        }

        const currentValue = input.value;

        const cursorPosition =
            input.selectionStart ?? currentValue.length;

        const newValue =
            currentValue.slice(0, cursorPosition)
            + event.key
            + currentValue.slice(cursorPosition);

        const regex = /^\d*\.?\d{0,3}$/;

        if (!regex.test(newValue))
        {
            event.preventDefault();
        }

    }

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

    onPurchaseSelected(
        row: any): void
    {
        this.purchaseService
            .GetPurchaseByInwardNo(
                row.InwardNo)
            .subscribe({

                next: (response) =>
                {

                    this.populatePurchase(
                        response);

                    this.cdRef.detectChanges();
                },

                error: (error) =>
                {
                    console.error(error);
                }
            });
    }

    populatePurchase(
        purchase: any): void
    {
        // Master

        this.nextInwardNo =
            purchase.purchaseMaster.inwardNo;

        this.chalanNo =
            purchase.purchaseMaster.chalanNo;

        this.pDate =
                purchase.purchaseMaster.pDate.split('T')[0];

        this.partyName =
            purchase.purchaseMaster.partyName;

        this.terms =
            purchase.purchaseMaster.terms;

        this.remarks =
            purchase.purchaseMaster.remarks;

        this.purchaseBy =
            purchase.purchaseMaster.purchaseBy;

        this.totalAmount =
            purchase.purchaseMaster.totalAmount;

        this.discountPercent =
            purchase.purchaseMaster.discountPercent;

        this.extraCost =
            purchase.purchaseMaster.extraCost;

        this.netAmount =
            purchase.purchaseMaster.netAmount;

     
            this.purchaseItems =
        purchase.purchaseDetails.map(
            (x: any) => ({
                ItemName: x.itemName,
                SubParts: x.subParts,
                Quantity: x.quantity,
                Rate: x.rate,
                CGST: x.cgst,
                SGST: x.sgst,
                SerTax: x.serTax,
                Amount: x.amount,
                Remarks: x.remarks
            })
        );

        // Details

        this.rowData =
            [...this.purchaseItems];

        // Edit Mode

        this.isEditPurchaseMode =
            true;

        this.showFindDialog =
            false;
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
        if(this.isEditPurchaseMode)
        {
            this.updatePurchase();

            return;
        }

        this.createPurchase();
    }

  createPurchase(): void
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

    updatePurchase(): void
    {
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

        this.purchaseService
            .UpdatePurchase(payload)
            .subscribe({

                next: (response) =>
                {
                    alert(response.message);

                    this.resetPurchaseScreen();

                    this.loadNextInwardNo();

                    this.isEditPurchaseMode =
                        false;
                },

                error: (error) =>
                {
                    console.error(error);
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
        this.loadNextInwardNo();

        this.isEditPurchaseMode = false;
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

    deletePurchase(): void
    {
        if (!this.isEditPurchaseMode)
        {
            return;
        }

        const confirmed =
            confirm(
                `Do you want to delete Purchase Entry with Inward No. "${this.nextInwardNo}"?`
            );

        if (!confirmed)
        {
            return;
        }

        this.purchaseService
            .DeletePurchase(
                this.nextInwardNo
            )
            .subscribe({

                next: (response) =>
                {

                    if (response.success)
                    {

                        alert(response.message);

                        this.resetPurchaseScreen();

                        this.loadNextInwardNo();

                        this.isEditPurchaseMode =
                            false;
                    }
                },

                error: (error) =>
                {
                    console.error(error);

                    alert(
                        'Error while deleting purchase'
                    );
                }
            });
    }


        // ========================================
        // Keyboard Shortcuts
        // ========================================

        @HostListener('document:keydown', ['$event'])
        onKeydown(event: KeyboardEvent): void
        {
            if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'f')
            {
                this.openFindDialog();
            }

            if(event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's')
            {
                this.savePurchase();
            }

            if(event.key === 'Delete')
            {
                this.deletePurchase();
            }

        }


}
