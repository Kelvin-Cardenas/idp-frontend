import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

   create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  delete(id: number) {
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
}
