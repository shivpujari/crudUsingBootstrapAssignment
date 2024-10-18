import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { AddEditDialogComponent } from '../add-edit-dialog/add-edit-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddEditDialogComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productService = inject(ProductsService)
  products: Product[] = []
  showModal: boolean = false
  selectedProduct: Product | null = null

  ngOnInit(): void {
    this.loadProducts()
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products
      },
      error: (error: any) => {
        console.log(`getProducts() failed => `, error)
      }
    })
  }

  showDialog(product?: Product): void {
    this.selectedProduct = product || null
    this.showModal = true
  }

  addProduct(product: Product): void {
    this.productService.addProduct(product).subscribe({
      next: () => {
        this.loadProducts()
      },
      error: (error: any) => {
        console.log(`addProduct() failed => `, error)
      }
    })
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe({
      next: () => {
        this.loadProducts()
      },
      error: (error: any) => {
        console.log(`updateProduct() failed`, error);
      }
    })
  }

  onDialogClosed(product: Product): void {
    if (!product.id) {
      this.addProduct(product);
    } else {
      this.updateProduct(product)
    }
    this.showModal = false
  }

  deleteProduct(id: number): void {
    this.productService.deleteProducts(id).subscribe({
      next: () => {
        this.loadProducts()
      },
      error: (error) => {
        console.log(` deleteProduct() faild`, error);

      }
    })
  }

  closeDialog(): void {
    this.showModal = false
  }

}
