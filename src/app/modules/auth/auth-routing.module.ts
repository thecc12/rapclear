import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Authentification Component
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Authentification'
    },
    children: [
      {
        path: '',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login'
        }
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            component: RegisterComponent,
            data: {
              title: 'Register'
            }
          },
          {
            path: '**',
            component: RegisterComponent,
            data: {
              title: 'Register'
            }
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'login'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
