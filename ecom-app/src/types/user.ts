export interface AddressDTO {
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export enum UserRole {
  ADMIN,
  CUSTOMER,
}

export interface UserResponse {
  id: string;
  keyCloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: AddressDTO | null;
}
