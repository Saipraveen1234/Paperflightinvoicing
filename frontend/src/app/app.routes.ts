import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CreateInvoiceComponent } from './components/create-invoice/create-invoice';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details';
import { ChangePasswordComponent } from './components/change-password/change-password';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'create-invoice', component: CreateInvoiceComponent },
    { path: 'invoice/:id', component: InvoiceDetailsComponent },
    { path: 'change-password', component: ChangePasswordComponent },
];
