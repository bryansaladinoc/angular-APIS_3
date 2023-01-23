import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { CreateUserDTO } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	private API_URL = `${environment.API_URL}/api/users`;

	constructor(private http: HttpClient) {}

	create(dto: CreateUserDTO) {
		return this.http.post(this.API_URL, dto);
	}

	getAll() {
		return this.http.get(this.API_URL);
	}
}
