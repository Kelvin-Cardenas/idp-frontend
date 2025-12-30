
import { ChangeDetectorRef, Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  private routerSub!: Subscription;
  deleteModal = false;
  selectedUser?: User;
  loading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private zone: NgZone,              // 👈 añade NgZone
    private cdr: ChangeDetectorRef     // 👈 añade ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();

    // Si quieres mantener la recarga al re-navegar dentro de /users
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUsers();
      });
  }

  loadUsers(): void {
    this.userService.findAll().subscribe({
      next: data => {
        // 👇 Asegura que corra dentro de Angular
        this.zone.run(() => {
          this.users = data;
          this.cdr.detectChanges(); // o markForCheck()
        });
      },
      error: err => console.error(err)
    });
  }

  trackById(index: number, user: User): number {
    return user.id!;
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }


  openDeleteModal(user: User): void {
  this.selectedUser = user;
  this.deleteModal = true;
}

closeDeleteModal(): void {
  this.deleteModal = false;
  this.selectedUser = undefined;
}




confirmDelete(): void {
    if (!this.selectedUser || this.loading) return;

    this.loading = true;
    const userId = this.selectedUser.id!;

    this.userService.delete(userId).subscribe({
      next: () => {
        // 👇 Garantiza que esto corra dentro de Angular (activa CD)
        this.zone.run(() => {
          // 1) Quita el usuario
          this.users = this.users.filter(u => u.id !== userId);

          // 2) Cierra modal y limpia selección
          this.closeDeleteModal();

          // 3) Termina loading
          this.loading = false;

          // 4) Asegura la pintura del cambio (por si usas OnPush o algo externo)
          this.cdr.detectChanges();
          // O: this.cdr.markForCheck();
        });
      },
      error: err => {
        console.error(err);
        // También dentro de Angular para que el estado se refleje
        this.zone.run(() => {
          this.loading = false;
          alert('Error al eliminar usuario');
          this.cdr.detectChanges();
        });
      }
    });

}



}
