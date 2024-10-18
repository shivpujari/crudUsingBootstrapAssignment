import { ChangeDetectorRef, Component, inject, NO_ERRORS_SCHEMA } from '@angular/core';
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
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  productService = inject(ProductsService);
  products: Product[] = [];
  showModal: boolean = false;
  selectedProduct: Product | null = null;
  chageDetectorRef = inject(ChangeDetectorRef)

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0; // Total number of products

  barChartData: any[] = [];
  lineChartData: any[] = [];
  lineChartConfig: any = {
    view: [700, 400], // Set chart dimensions
    showLegend: true,
    showLabels: true,
    autoScale: true,
    colorScheme: { domain: ['#5AA454', '#C7B42C', '#AAAAAA'] }, // Set color scheme
  };

  barChartConfig = {
    view: [700, 400] as [number, number],
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
    showLabels: true,
  };

  ngOnInit(): void {
    this.loadProducts();
    this.setChartDimensions(); // Set initial dimensions
  window.addEventListener('resize', this.setChartDimensions.bind(this));
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        if (products) {
          this.products = products;
          this.totalItems = products.length; 
          this.updateCharts();
        }
      },
      error: (error: any) => {
        console.log(`getProducts() failed => `, error);
      },
    });
  }

  updateCharts(): void {
    const paginatedProducts = this.getPaginatedProducts();
    this.barChartData = paginatedProducts.map((data) => ({
      name: data.name,
      value: data.price,
    }));

    this.lineChartData = [
      {
        name: 'Products',
        series: paginatedProducts.map((data) => ({
          name: data.name, // X-axis
          value: data.price, // Y-axis
        })),
      },
    ];
  }

  getPaginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
}

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage++;
      this.updateCharts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCharts();
    }
  }

  showDialog(product?: Product): void {
    this.selectedProduct = product || null;
    this.showModal = true;
  }

  addProduct(product: Product): void {
    this.productService.addProduct(product).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error: any) => {
        console.log(`addProduct() failed => `, error);
      },
    });
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error: any) => {
        console.log(`updateProduct() failed`, error);
      },
    });
  }

  onDialogClosed(product: Product): void {
    if (!product.id) {
      this.addProduct(product);
    } else {
      this.updateProduct(product);
    }
    this.showModal = false;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProducts(id).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        console.log(`deleteProduct() failed`, error);
      },
    });
  }

  closeDialog(): void {
    this.showModal = false;
  }
  setChartDimensions() {
    const width = window.innerWidth;
    
    // Adjust chart dimensions based on screen size
    switch (true) {
      case (width <= 480): // Small screens
        this.barChartConfig.view = [300, 200]; // Chart 1 dimensions for small screens
        this.lineChartConfig.view = [300, 200]; // Chart 2 dimensions for small screens
        break;
  
      case (width <= 768): // Medium screens
        this.barChartConfig.view = [500, 300]; // Chart 1 dimensions for medium screens
        this.lineChartConfig.view = [500, 300]; // Chart 2 dimensions for medium screens
        break;
  
      case (width <= 1024): // Large screens
        this.barChartConfig.view = [700, 400]; // Chart 1 dimensions for large screens
        this.lineChartConfig.view = [700, 400]; // Chart 2 dimensions for large screens
        break;
  
      default: // Extra large screens
        this.barChartConfig.view = [900, 500]; // Chart 1 dimensions for extra large screens
        this.lineChartConfig.view = [900, 500]; // Chart 2 dimensions for extra large screens
    }
    
    // Optional: You can also trigger a change detection if necessary
    this.chageDetectorRef.detectChanges();
  }
  
}
