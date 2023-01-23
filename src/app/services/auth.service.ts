import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthModel } from "../models/auth.model";
import { UserModel } from "../models/user.model";
import { switchMap, tap } from "rxjs/operators";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private API_URL = `${environment.API_URL}/api/auth`;

	constructor(private http: HttpClient, private tokenService: TokenService) {}

	login(email: string, password: string) {
		return this.http
			.post<AuthModel>(`${this.API_URL}/login`, {
				email,
				password,
			})
			.pipe(
				tap((response) => this.tokenService.saveToken(response.access_token)),
			);
	}

	getProfile() {
		// const headers = new HttpHeaders();
		// headers.set("Authorization", `Bearer ${token}`);

		return this.http.get<UserModel>(`${this.API_URL}/profile`, {
			// headers: {
			// 	Authorization: `Bearer ${token}`,
			// },
		});
	}

	fetchLoginAndProfile(email: string, password: string) {
		return this.login(email, password).pipe(switchMap(() => this.getProfile()));
	}
}
