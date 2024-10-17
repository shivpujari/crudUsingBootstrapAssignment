import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { AddEditDialogComponent } from '../add-edit-dialog/add-edit-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddEditDialogComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  productService = inject(ProductsService)
  products: Product[] = []
  

  ngOnInit():void {
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
  showDialog():void{

  }

}
