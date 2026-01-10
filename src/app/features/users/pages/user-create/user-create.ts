
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
     this.user.eventName = 'Congreso nacional Ica';
      this.user.eventDate = '2026-02-08';
    if (this.loading) return;
    this.loading = true;
    // Refleja “Guardando...”
    this.cd.markForCheck();

    this.userService.create(this.user)
      .pipe(finalize(() => {
        // Finaliza loading en Angular
        this.zone.run(() => {
          this.loading = false;
          this.cd.detectChanges();   // o markForCheck() si prefieres
        });
      }))
      .subscribe({
        next: () => {
          // 👇 Ejecuta cambios de UI dentro de Angular
          this.zone.run(() => {
            this.successModal = true;   // mostrar modal
            this.cd.detectChanges();    // asegurar repintado inmediato
          });
        },
        error: () => {
          this.zone.run(() => {
            alert('Error al crear usuario');
            this.loading = false;
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
