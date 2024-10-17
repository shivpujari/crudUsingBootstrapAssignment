import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  httpClient = inject(HttpClient)
  private baseURL = environment.baseURL

  private productSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productSubject.asObservable();

  constructor() {
    this.loadProducts()
  }

  loadProducts() {
    this.httpClient.get<Product[]>(`${this.baseURL}/products`)
      .subscribe(products => {
        this.productSubject.next(products);
      });
  }

  getProducts(): Observable<Product[]> {
    return this.products$
  }

  addProduct(product: Product): Observable<Product> {
    return this.httpClient.post<Product>(this.baseURL, product).pipe(tap(() => this.loadProducts()))
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.put<Product>(`${this.baseURL}/products/${product.id}`, product).pipe(tap(() => this.loadProducts()))
  }

  deleteProducts(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseURL}/products/${id}`).pipe(tap(() => { this.loadProducts() }))
  }
}
