import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {NgxWebstorageModule} from 'ngx-webstorage';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LoginComponent} from './login/login.component';
import {SettingsComponent} from './settings/settings.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LogoutComponent} from './logout/logout.component';
import {ApiService, StorageService, UserService} from './_services';

import {OverviewComponent} from './overview/overview.component';
import {FoodInfoComponent} from './overview/food-info/food-info.component';
import {PollComponent} from './overview/poll/poll.component';
import {PollResultsComponent} from './overview/poll-results/poll-results.component';
import {RegisterComponent} from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    NavbarComponent,
    LoginComponent,
    SettingsComponent,
    PageNotFoundComponent,
    LogoutComponent,
    FoodInfoComponent,
    PollComponent,
    PollResultsComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxWebstorageModule.forRoot(),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UserService, StorageService, ApiService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
