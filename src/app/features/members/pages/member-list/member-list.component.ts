import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Member } from '../../../../core/models/member';
import { MemberRequest } from '../../../../core/models/MemberRequest';
import { MemberService } from '../../../../core/services/member.service';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  members: Member[] = [];
  successMessage = '';
  showSuccess = false;

  member: MemberRequest = {
    firstName: '',
    lastName: '',
    documentNumber: '',
    gender: '',
    birthday: '',
    phoneNumber: '',
    email: '',
    address: '',
    conversionDate: '',
    baptismDate: '',
    churchId: 0
  };

  totalMembers = 0;
  activeMembers = 0;
  newMembers = 0;

  showModal = false;

  constructor(
    private memberService: MemberService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMembers();
  }

    loadMembers(): void {
      this.memberService.getMembers().subscribe({
        next: (data) => {
          this.members = data;
          this.calculateStats();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error obteniendo miembros', error);
        }
      });
    }

  calculateStats(): void {
    this.totalMembers = this.members.length;

    this.activeMembers = this.members.filter(
      m => m.baptismDate != null
    ).length;

    this.newMembers = this.members.length;
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

saveMember(): void {

  this.memberService.createMember(this.member).subscribe({

    next: (response) => {

      console.log('✅ Miembro creado correctamente:', response);

      // Cerrar formulario
      this.showModal = false;

      // Limpiar formulario
      this.resetForm();

      // Actualizar tabla
      this.loadMembers();

      // Mostrar mensaje
      this.successMessage = 'El miembro fue registrado correctamente.';
      this.showSuccess = true;

      // Ocultar después de 3 segundos
      setTimeout(() => {

        this.showSuccess = false;

        this.cdr.detectChanges();

      }, 3000);

    },

    error: (error) => {

      console.error('❌ Error al crear miembro:', error);

    }

  });

}
  openDatePicker(event: Event): void {
    const input = event.target as HTMLInputElement;

    if ('showPicker' in input) {
      input.showPicker();
    }
  }

  capitalizeWords(text: string): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  resetForm(): void {
    this.member = {
      firstName: '',
      lastName: '',
      documentNumber: '',
      gender: '',
      birthday: '',
      phoneNumber: '',
      email: '',
      address: '',
      conversionDate: '',
      baptismDate: '',
      churchId: 0
    };
  }

}