import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-dialog.component.html',
  styleUrl: './add-edit-dialog.component.scss'
})
export class AddEditDialogComponent {
  @Input() product: Product | null = null
  @Output() dialogClosed = new EventEmitter<Product>()

  formBuilder = inject(FormBuilder)
  form: any = FormGroup
  editMode: boolean = false

  constructor() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required]
    })
  }

  ngOnChanges(): void {
    if (this.product) {
      this.editMode = true
      this.form.patchValue({
        name: this.product.name,
        price: this.product.price,
        category: this.product.category
      })
    } else {
      this.editMode = false
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.editMode == true && this.product) {
        // this.form.value['id'] = this.product.id
      }
      this.dialogClosed.emit(this.form.value)
    }
  }

  onClose(): void {
    // this.closeDialog.emit()
  }


}

