import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  original_price: number;
  rating: number;
  preview: string;
  discount: number;
  category_id: number;
  author_id: number;
  publisher_id: number;
  author: {
    id: number;
    name: string;
  };
  publisher: {
    id: number;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getHighDiscountProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/flash-sale`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  getProductsByAuthorName(authorName: string): Observable<Product[]> {
    const encodedAuthorName = encodeURIComponent(authorName);
    return this.http.get<Product[]>(`${this.apiUrl}/author/${encodedAuthorName}`);
  }

  getProductsByPublisherName(publisherName: string): Observable<Product[]> {
    const encodedPublisherName = encodeURIComponent(publisherName);
    return this.http.get<Product[]>(`${this.apiUrl}/publisher/${encodedPublisherName}`);
  }
}
