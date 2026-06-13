import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PurchaseEntry } from './components/purchase-entry/purchase-entry';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PurchaseEntry],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('purchase-crud-ui');
}
