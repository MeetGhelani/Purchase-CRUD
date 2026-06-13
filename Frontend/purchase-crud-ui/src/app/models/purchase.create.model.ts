import {PurchaseDetailModel} from "./purchase.detail.model";

export interface PurchaseCreateModel {
    InwardNo: number;
    ChalanNo: number;
    PDate: Date;

    PartyName: string;
    Terms: number;
    Remarks: string;
    PurchaseBy: string;

    TotalAmount: number;
    DiscountPercent: number;
    ExtraCost: number;
    NetAmount: number;

    Items: PurchaseDetailModel[];
}