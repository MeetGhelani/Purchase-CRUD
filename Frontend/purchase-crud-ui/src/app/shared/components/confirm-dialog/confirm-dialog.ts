import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {

@Input () title: string = '';

@Input () message: string = '';

@Input () confirmText: string = 'Confirm';

@Input () cancelText: string = 'Cancel';

@Output () confirmClick = new EventEmitter<void>();

@Output () cancelClick = new EventEmitter<void>();

  onConfirm() : void {
    this.confirmClick.emit();
  }

  onCancel() : void {
    this.cancelClick.emit();
  }

}