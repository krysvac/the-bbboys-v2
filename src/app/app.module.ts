import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {OverviewComponent} from './overview/overview.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
    declarations: [
        AppComponent,
        OverviewComponent,
        NavbarComponent,
        LoginComponent,
        SettingsComponent,
        PageNotFoundComponent,
        LogoutComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
