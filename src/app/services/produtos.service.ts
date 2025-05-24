import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }
}