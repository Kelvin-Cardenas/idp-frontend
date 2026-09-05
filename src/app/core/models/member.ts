import { Church } from "./Church";

export interface Member {
  id?: number;
  firstName: string;
  lastName: string;
  documentNumber: string;
  gender: string;
  birthday: string;
  phoneNumber: string;
  email: string;
  address: string;
  conversionDate: string;
  baptismDate: string;
  church: Church;

}