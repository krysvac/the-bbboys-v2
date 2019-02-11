import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {StorageService, UserService} from '../_services';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private storage: StorageService, private router: Router) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userService.isLoggedIn()) {
            return this.userService.auth().pipe(map((res: Response) => {
                if (res !== null && res['token'] !== null && res['token'] !== '') {
                    this.storage.store('auth_token', res['token']);
                    return true;
                } else {
                    this.userService.setUserLoggedOut();
                    return false;
                }
            })).pipe(
                catchError(() => of(false, this.handleError()))
            );
        } else {
            this.userService.setUserLoggedOut();
            this.router.navigate(['login/']);
            return false;
        }
    }

    private handleError() {
        this.userService.setUserLoggedOut();
        this.router.navigate(['login/']);
        return false;
    }
}
