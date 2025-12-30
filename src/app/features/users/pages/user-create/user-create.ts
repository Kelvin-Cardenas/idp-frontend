
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
  user: User = { name: '',lastName:'', phoneNumber:'',email: '' };
  loading = false;
  successModal = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private zone: NgZone,            // 👈 añade NgZone
  ) {}

  save(): void {
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
