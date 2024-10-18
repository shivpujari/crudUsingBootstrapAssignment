import { Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CommonModule } from '@angular/common';
import { AddEditDialogComponent } from '../add-edit-dialog/add-edit-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, AddEditDialogComponent, NgxChartsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  productService = inject(ProductsService)
  products: Product[] = []
  showModal: boolean = false
  selectedProduct: Product | null = null


  barChartData: any[] = []
  lineChartData: any[] = []
  lineChartConfig:any = {
    view: [700, 400], // Set chart dimensions
    showLegend: true,
    showLabels: true,
    autoScale: true,
    colorScheme: { domain: ['#5AA454', '#C7B42C', '#AAAAAA'] } // Set color scheme
  };

  barChartConfig = {
    view: [350, 300] as [number, number],
    showXAxis: true,
    showYAxis: true,
    gradient: true,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Name',
    showYAxisLabel: true,
    yAxisLabel: 'Price',
    timeline: true,
    doughnut: true,
    colorScheme: {},
    showLabels: true
  }
  ngOnInit(): void {
    this.loadProducts()
    this.updateLineChartData()
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        if (products) {
          this.products = products
        }
        this.barChartData = products.map((data) => ({
          name: data.name,
          value: data.price
        }))
        this.updateLineChartData();
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

  updateLineChartData(): void {
    this.lineChartData = [
      {
        name: "Products",
        series: this.products.map((data) => ({
          name: data.name, // X-axis
          value: data.price // Y-axis
        }))
      }
    ];
  }

  closeDialog(): void {
    this.showModal = false
  }

}
