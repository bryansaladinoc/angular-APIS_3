import { Component, OnInit } from "@angular/core";
import { UserModel } from "../../models/user.model";
import { StoreService } from "../../services/store.service";
import { AuthService } from "../../services/auth.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
	// rome-ignore lint/suspicious/noExplicitAny: <explanation>
	profile: any;
	token: string = "";
	activeMenu = false;
	counter = 0;

	constructor(
		private storeService: StoreService,
		private usersService: UsersService,
		private authService: AuthService,
	) {}

	ngOnInit(): void {
		this.storeService.myCart$.subscribe((products) => {
			this.counter = products.length;
		});
	}

	toggleMenu() {
		this.activeMenu = !this.activeMenu;
	}

	login() {
		this.authService
			.login("bryan@mail.com", "12345")
			.subscribe((r) => console.log(r));
	}

	getProfile() {
		this.authService
			.getProfile()
			.subscribe((profile) => (this.profile = profile));
	}

	loginAndProfile() {
		this.authService
			.fetchLoginAndProfile("bryan@mail.com", "12345")
			.subscribe((user) => {
				this.profile = user;
			});
	}

	createUser() {
		this.usersService
			.create({
				name: "Bryan",
				email: "bryan@mail.com",
				password: "12345",
			})
			.subscribe((r) => console.log(r));
	}
}
