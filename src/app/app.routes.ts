import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Public
  { path: 'login',           loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup',          loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password',  loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },

  // Protégées
  { path: 'dashboard',    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'products-hub', loadComponent: () => import('./pages/products-hub/products-hub').then(m => m.ProductsHub),            canActivate: [authGuard] },
  { path: 'products',     loadComponent: () => import('./pages/products/products').then(m => m.Products),                      canActivate: [authGuard] },
  { path: 'produtos',     loadComponent: () => import('./pages/produtos/produtos.component').then(m => m.ProdutosComponent),   canActivate: [authGuard] },
  { path: 'stock',        loadComponent: () => import('./pages/stock/stock').then(m => m.Stock),                               canActivate: [authGuard] },
  { path: 'customers',    loadComponent: () => import('./pages/customers/customers').then(m => m.CustomersComponent),           canActivate: [authGuard] },
  { path: 'orders',       loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),                    canActivate: [authGuard] },
  { path: 'payments',     loadComponent: () => import('./pages/payments/payments').then(m => m.PaymentsComponent),              canActivate: [authGuard] },
  { path: 'settings',     loadComponent: () => import('./pages/settings/settings').then(m => m.Settings),                       canActivate: [authGuard] },
  { path: 'categories',   loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent), canActivate: [authGuard] },
  { path: 'fornecedores', loadComponent: () => import('./pages/fornecedores/fornecedores.component').then(m => m.FornecedoresComponent), canActivate: [authGuard] },
  { path: 'mouvements',   loadComponent: () => import('./pages/mouvements/mouvements.component').then(m => m.MouvementsComponent), canActivate: [authGuard] },
  { path: 'profile',      loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),       canActivate: [authGuard] },
  { path: 'about',        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),             canActivate: [authGuard] },
  { path: 'usuarios',     loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),    canActivate: [roleGuard('ADMIN')] },

  // Redirections
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' }
];
