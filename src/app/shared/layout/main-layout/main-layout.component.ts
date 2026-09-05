import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Member } from '../../../core/models/member';
import { MemberService } from '../../../core/services/member.service';
import { MemberRequest } from '../../../core/models/MemberRequest';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  members: Member[] = [];
  totalMembers: number = 0;

  constructor(
    private memberService: MemberService
  ) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.memberService.getMembers().subscribe({
      next: (data) => {
        console.log('Miembros recibidos:', data);

        this.members = data;
        this.totalMembers = this.members.length;

        console.log('Total miembros:', this.totalMembers);
      },
      error: (error) => {
        console.error('Error obteniendo miembros:', error);
      }
    });
  }
}