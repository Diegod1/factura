import { Routes } from '@angular/router';
import { LoginPageComponent } from './modules/auth/ui/pages/login-page/login-page.component';
import { DashboardPageComponent } from './modules/dashboard/ui/pages/dashboard-page/dashboard-page.component';
import { FacturationComponent } from './modules/facturation/ui/pages/facturation/facturation.component';

export const routes: Routes = [
    { path: 'login', component: LoginPageComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardPageComponent },
    { path: 'facturation', component: FacturationComponent },
];
