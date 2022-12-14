import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './header/user/user.component';
import { NotificationComponent } from './header/notification/notification.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterDialog } from './login/register-dialog/register-dialog.component';
import { AlertComponent } from './popups/alert/alert.component';
import { APIInterceptor } from './services/api-interceptor.service';
import { RegisterDialogNewComponent } from './login/register-dialog-new/register-dialog-new.component';
import { ForgotPasswordComponent } from './login/forgot-password-dialog/forgot-password.component';
import { HaveSubmenuDirective, Sidebar2Component } from './layout/sidebar2/sidebar2.component';
import { LoaderComponent } from './loader/loader.component';

// import { DashboardComponent, QuickMenuDialog } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterDialog,
    LayoutComponent,
    HeaderComponent,
    UserComponent,
    NotificationComponent,
    SidebarComponent,
    AlertComponent,
    RegisterDialogNewComponent,
    ForgotPasswordComponent,
    Sidebar2Component,
    HaveSubmenuDirective,
    LoaderComponent,

    // DashboardComponent,
    // QuickMenuDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports:  [],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }
