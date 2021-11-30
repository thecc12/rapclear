import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RequestsComponent } from './requests.component';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
  imports: [
    FormsModule,
    RequestsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ RequestsComponent ]
})
export class RequestsModule { }
