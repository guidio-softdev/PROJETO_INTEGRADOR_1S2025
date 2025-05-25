import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly API = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.API);
  }

  getProductById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.API}/${id}`);
  }

  createProduct(productData: Partial<Produto>): Observable<Produto> {
    return this.http.post<Produto>(this.API, productData);
  }

  updateProduct(id: number, productData: Partial<Produto>): Observable<Produto> {
    return this.http.put<Produto>(`${this.API}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}