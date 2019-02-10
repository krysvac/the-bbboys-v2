import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {LoginComponent} from './login/login.component';
import {SettingsComponent} from './settings/settings.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LogoutComponent} from './logout/logout.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
    {path: '', redirectTo: '/overview', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
    {path: 'overview', component: OverviewComponent},
    {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
