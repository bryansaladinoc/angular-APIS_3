import { Injectable } from "@angular/core";
import {
	HttpClient,
	HttpParams,
	HttpErrorResponse,
	HttpStatusCode,
} from "@angular/common/http";
import {
	retry,
	retryWhen,
	catchError,
	throwIfEmpty,
	map,
} from "rxjs/operators";
import { throwError, zip } from "rxjs";
import {
	Product,
	CreateProductDTO,
	UpdateProductDTO,
} from "./../models/product.model";
import { environment } from "../../environments/environment";
import { checkTime } from "../interceptors/time.interceptor";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
	private apiUrl = `${environment.API_URL}/api/products`;
	constructor(private http: HttpClient) {}

	getAllProducts(limit?: number, offset?: number) {
		let params: HttpParams = new HttpParams();
		if (limit !== undefined && offset !== undefined) {
			params = params.set("limit", limit);
			params = params.set("offset", offset);
		}

		return this.http
			.get<Product[]>(this.apiUrl, { params, context: checkTime() })
			.pipe(
				retry(3),
				map((products) =>
					products.map((item) => {
						return {
							...item,
							taxes: 0.19 * item.price,
						};
					}),
				),
			);
	}

	getProduct(id: string) {
		return this.http
			.get<Product>(`${this.apiUrl}/${id}`, { context: checkTime() })
			.pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 500) {
						return throwError("Ups esta fallando en el server");
					}
					if (error.status === HttpStatusCode.NotFound) {
						return throwError("El producto no existe");
					}

					return throwError("Ups algo salio mal");
				}),
			);
	}

	fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
		return zip(this.getProduct(id), this.update(id, { title: "nuevo" }));
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
