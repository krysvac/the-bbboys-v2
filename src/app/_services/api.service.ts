import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {CanVote, Food, PollWithChoices, VotingAllowed} from '../types';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../types/answer';
import {UserService} from './user.service';
import {RegistrationLink} from '../types/registrationLink';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API_URL;

    private addAuthToken(headers: HttpHeaders) {
        headers.append('token', this.storage.retrieve('auth_token'));
    }

    public httpOptions = {
        headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8'
            }
        )
    };

    constructor(private http: HttpClient, private storage: StorageService, private user: UserService) {
        this.API_URL = environment.apiUrl + '/';
    }

    getPoll(): Observable<PollWithChoices> {
        return this.http.get<PollWithChoices>(this.API_URL + 'poll/1', this.httpOptions);
    }

    getAllAnswers(): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.API_URL + 'votes/1', this.httpOptions);
    }

    getBistroJFood(): Observable<Food> {
        return this.http.get<Food>(this.API_URL + 'food/bistroj', this.httpOptions);
    }

    getVillaFood(): Observable<Food> {
        return this.http.get<Food>(this.API_URL + 'food/villa', this.httpOptions);
    }

    getUserCanVote(): Observable<CanVote> {
        return this.http.get<CanVote>(this.API_URL + 'userCanVote', {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    getVotingIsAllowed(): Observable<VotingAllowed> {
        return this.http.get<VotingAllowed>(this.API_URL + 'votingIsAllowed', {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    getAnswerForUser(): Observable<Answer> {
        return this.http.get<Answer>(this.API_URL + 'selectedChoice', {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    vote(obj: Object): Observable<any> {
        this.addAuthToken(this.httpOptions.headers);
        return this.http.post(this.API_URL + 'vote', JSON.stringify(obj), {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    getRegisterLinks(): Observable<RegistrationLink[]> {
        if (this.user.isAdmin()) {
            return this.http.get<RegistrationLink[]>(this.API_URL + 'registrationLinks', {
                    headers: new HttpHeaders({
                            'Content-Type': 'application/json; charset=utf-8',
                            'token': this.storage.retrieve('auth_token')
                        }
                    )
                }
            );
        }
    }

    createRegisterLink(): Observable<any> {
        if (this.user.isAdmin()) {
            return this.http.post(this.API_URL + 'createLink', null, {
                    headers: new HttpHeaders({
                            'Content-Type': 'application/json; charset=utf-8',
                            'token': this.storage.retrieve('auth_token')
                        }
                    )
                }
            );
        }
    }

    changePassword(obj: Object): Observable<any> {
        return this.http.post(this.API_URL + 'changePassword', JSON.stringify(obj), {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json; charset=utf-8',
                        'token': this.storage.retrieve('auth_token')
                    }
                )
            }
        );
    }

    validateToken(obj: Object): Observable<any> {
        return this.http.post(this.API_URL + 'validateToken', JSON.stringify(obj), this.httpOptions);
    }

    registerUser(obj: Object): Observable<any> {
        return this.http.post(this.API_URL + 'register', JSON.stringify(obj), this.httpOptions);
    }
}
