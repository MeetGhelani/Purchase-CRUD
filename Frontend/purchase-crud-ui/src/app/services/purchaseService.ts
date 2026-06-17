import{Injectable}from'@angular/core';
import{HttpClient,HttpHeaders}from'@angular/common/http';
import{Observable}from'rxjs';
import{ApiResponseModel}from'../models/api.response.model';
import{PurchaseCreateModel}from'../models/purchase.create.model';
import { environment } from '../environment/environment';
import { NextInwardModel } from '../models/nextinward.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
    
    private apiUrl = environment.apiBaseUrlpurchase;
    constructor(private http: HttpClient) {

    }

    GetNextInwardNo(): Observable<NextInwardModel> {
        return this.http.get<NextInwardModel>(
            `${this.apiUrl}/next-inward-no`);
    }

    SavePurchase(purchase: PurchaseCreateModel): Observable<ApiResponseModel> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<ApiResponseModel>(
            `${this.apiUrl}/save-purchase`,
            purchase,{ headers: headers }
        );
    }

    GetPurchaseByInwardNo(inwardNo: number)
    {
        return this.http.get(
            `${this.apiUrl}/get-by-inwardno/${inwardNo}`
        );
    }

    UpdatePurchase(purchase: any)
    {
        return this.http.put<any>(
            `${this.apiUrl}/update-purchase`,
            purchase
        );
    }

    DeletePurchase(inwardNo: number)
    {
        return this.http.delete<any>(
            `${this.apiUrl}/delete-purchase/${inwardNo}`
        );
    }


}