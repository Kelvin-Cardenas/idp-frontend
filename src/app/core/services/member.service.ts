import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Member } from '../models/member'; 
import { MemberRequest } from '../models/MemberRequest';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private apiUrl = `${environment.apiUrl}api/members`;
  

  constructor(private http: HttpClient) {}

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(this.apiUrl);
  }

   createMember(member: MemberRequest): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  
}