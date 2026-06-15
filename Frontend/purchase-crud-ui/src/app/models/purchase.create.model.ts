import {PurchaseDetailModel} from "./purchase.detail.model";

export interface PurchaseCreateModel {
    inwardNo: number;
    chalanNo: number;
    pDate: string;

    partyName: string;
    terms: number;
    remarks: string;
    purchaseBy: string;

    totalAmount: number;
    discountPercent: number;
    extraCost: number;
    netAmount: number;

    items: PurchaseDetailModel[];
}