
import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.scss'],
  // Si usas OnPush:
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreateComponent {
  user: User = { 
     eventName: 'Congreso nacional Ica',
  eventDate: '2026-02-08',
    eventLocation: '',
    eventCost: 0,
    fullName: '',
    documentNumber: '',
    phone: '',
    email: '',
    memberRole: '',
    churchCampus: '',
    registrationCode: '',
    notes: '',
    paymentStatus: 'PENDIENTE'};
  loading = false;
  successModal = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private zone: NgZone,            // 👈 añade NgZone
  ) {}

  onEstadoCivilChange(): void {
  if (this.user.eventLocation === 'CASADO') {
    this.user.eventCost = 450;
  } else if (this.user.eventLocation === 'SOLTERO') {
    this.user.eventCost = 250;
  }
}

 save(): void {
  if (this.loading) return;

  // 🔒 Valores fijos
  this.user.eventName = 'Congreso nacional Ica';
  this.user.eventDate = '2026-02-08';

  // ✅ Forzar estado de pago (aunque no se muestre)
  this.user.paymentStatus = 'PENDIENTE';

  // 🔴 Validación mínima
  if (!this.user.eventLocation || !this.user.fullName || !this.user.email) {
    alert('Complete los campos obligatorios');
    return;
  }

  this.loading = true;
  this.cd.markForCheck();

  this.userService.create(this.user)
    .pipe(finalize(() => {
      this.zone.run(() => {
        this.loading = false;
        this.cd.detectChanges();
      });
    }))
    .subscribe({
      next: () => {
        this.zone.run(() => {
          this.successModal = true;
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        console.error('ERROR BACKEND 👉', err);
        this.zone.run(() => {
          alert('Error al registrar inscripción');
          this.cd.detectChanges();
        });
      }
    });
}


  
closeModal(): void {
  this.zone.run(() => {
    this.successModal = false;
    // this.cd.detectChanges(); // puedes omitirlo
    this.router.navigate(['/users']);
  });
}

}
