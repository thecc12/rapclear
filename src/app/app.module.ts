import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { Footer2Component } from './shared/footer2/footer2.component';
import { Header2Component } from './shared/header2/header2.component';
import { NavbarsComponent } from './shared/navbars/navbars.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ProgressIndeterminateModule } from './modules/progress-indeterminate/progress-indeterminate.module';
import { AuthGuard } from './guard/auth.guard';
import { AdminerGuard } from './guard/adminer.guard';
import { UserManageGuard } from './guard/user-manage.guard';
import { EventService } from './services/event/event.service';
import Bugsnag from '@bugsnag/js';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { NgModule, ErrorHandler, enableProdMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SpinnerComponent } from './modules/components/spinner/spinner.component';
import { AngularFireDatabase } from '@angular/fire/database';

// configure Bugsnag asap
Bugsnag.start({ apiKey: '2737b9ab0303671f752970255de0f652' });

// create a factory which will return the Bugsnag error handler
export function errorHandlerFactory() {
  return new BugsnagErrorHandler();
}
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }

// enableProdMode
if (true) { enableProdMode(); } // true en prod et false en dev

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ProgressIndeterminateModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // ChatModule,
    ProgressIndeterminateModule,
    RouterModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    Footer2Component,
    Header2Component,
    NavbarsComponent,
  ],
  providers: [
    AngularFirestore,
    AngularFireDatabase, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
  BsModalService,
  AuthGuard,
  AdminerGuard,
  UserManageGuard,
  EventService,
  { provide: ErrorHandler,
    useFactory: errorHandlerFactory
  }, ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
