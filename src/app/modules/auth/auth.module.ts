import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Authentification Component
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

// Authentification Routing
import { AuthRoutingModule } from './auth-routing.module';
import { ProgressIndeterminateModule } from '../progress-indeterminate/progress-indeterminate.module';


// Angular

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    FormsModule,
    ProgressIndeterminateModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
