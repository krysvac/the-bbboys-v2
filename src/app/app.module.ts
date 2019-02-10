import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {OverviewComponent} from './overview/overview.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LoginComponent} from './login/login.component';
import {SettingsComponent} from './settings/settings.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LogoutComponent} from './logout/logout.component';
import {ApiService, StorageService, UserService} from './_services';
import {HttpClientModule} from '@angular/common/http';
import {NgxWebstorageModule} from 'ngx-webstorage';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FoodInfoComponent} from './food-info/food-info.component';
import {PollComponent} from './poll/poll.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PollResultsComponent } from './poll-results/poll-results.component';

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
        PollResultsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgxWebstorageModule.forRoot(),
        NgbModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [UserService, StorageService, ApiService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
