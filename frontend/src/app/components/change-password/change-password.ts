import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './change-password.html',
    styleUrl: './change-password.scss'
})
export class ChangePasswordComponent {
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    error = '';
    success = '';

    constructor(private authService: AuthService, private router: Router) { }

    changePassword() {
        this.error = '';
        this.success = '';

        if (this.newPassword !== this.confirmPassword) {
            this.error = 'New passwords do not match';
            return;
        }

        if (this.newPassword.length < 6) {
            this.error = 'Password must be at least 6 characters';
            return;
        }

        this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
            next: (response) => {
                if (response.success) {
                    this.success = 'Password changed successfully';
                    this.currentPassword = '';
                    this.newPassword = '';
                    this.confirmPassword = '';
                    setTimeout(() => this.router.navigate(['/dashboard']), 2000);
                }
            },
            error: (err) => {
                this.error = err.error?.error || 'Failed to change password';
                console.error('Change password error:', err);
            }
        });
    }

    cancel() {
        this.router.navigate(['/dashboard']);
    }
}
