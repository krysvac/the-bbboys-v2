import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';

@Injectable()
export class UserService {
    private readonly API_URL: string;
    public httpOptions: Object = {
        headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
            }
        )
    };


    constructor(private http: HttpClient, private storage: StorageService) {
        this.API_URL = environment.apiUrl + '/';
    }

    public login(obj: Object): Observable<any> {
        return this.http.post(this.API_URL + 'login', JSON.stringify(obj), this.httpOptions);
    }

    public auth(): Observable<any> {
        return this.http.get(this.API_URL + 'validateAuth', {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    public setUserLoggedIn(username: string, token: string, admin: boolean): void {
        this.storage.store('username', username);
        this.storage.store('auth_token', token);
        this.storage.store('admin', admin);
        this.storage.store('loggedIn', true);
    }

    public setUserLoggedOut(): void {
        this.storage.clearAll();
    }

    public isLoggedIn(): boolean {
        return this.storage.retrieve('loggedIn') !== '' && this.storage.retrieve('auth_token') !== '';
    }

    public isAdmin(): boolean {
        if (this.isLoggedIn()) {
            return this.storage.retrieve('admin') === 'true';
        } else {
            return false;
        }
    }

    public getUsername(): string {
        return this.storage.retrieve('username');
    }

    public getUserId(): string {
        return this.storage.retrieve('id');
    }
}
