// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Alert Component
import { AlertModule } from 'ngx-bootstrap/alert';
import { UserComponent } from './user/user.component';

// Modal module
import { ModalModule } from 'ngx-bootstrap/modal';

// Notifications Routing
import { ProfilRoutingModule } from './profil-routing.module';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfilRoutingModule,
    AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    UserComponent,
  ]
})
export class ProfilModule { }
