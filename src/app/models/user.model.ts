export interface UserModel {
	id: string;
	name: string;
	email: string;
	password: string;
}

export interface CreateUserDTO extends Omit<UserModel, "id"> {}
