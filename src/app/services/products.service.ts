import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, retryWhen, catchError, throwIfEmpty } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.API_URL}/api/products`;
  constructor(private http: HttpClient) { }

  getAllProducts(limit?: number, offset?: number) {
    let params: HttpParams = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(this.apiUrl, { params })
      .pipe(
        retry(3)
      );
  }

  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 500) {
            return throwError('Ups esta fallando en el server');
          }
          if (error.status === HttpStatusCode.NotFound) {
            return throwError('El producto no existe');
          }
          return throwError('Ups algo salio mal');
        })
      );
  }


  create(data: CreateProductDTO) {
    return this.http.post<Product>(`${this.apiUrl}`, data);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
