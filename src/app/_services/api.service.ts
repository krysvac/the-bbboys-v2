import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StorageService} from './storage.service';
import {CanVote, Food, PollWithChoices, VotingAllowed} from '../types';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {Answer} from '../types/answer';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly API_URL;
    public httpOptions = {
        headers: new HttpHeaders({
                'Content-Type': 'application/json; charset=utf-8',
                'token': this.storage.retrieve('auth_token')
            }
        )
    };

    constructor(private http: HttpClient, private storage: StorageService) {
        this.API_URL = environment.apiUrl + '/';
    }

    getPoll(): Observable<PollWithChoices> {
        return this.http.get<PollWithChoices>(this.API_URL + 'poll/1', this.httpOptions);
    }

    getBistroJFood(): Observable<Food> {
        return this.http.get<Food>(this.API_URL + 'food/bistroj', this.httpOptions);
    }

    getVillaFood(): Observable<Food> {
        return this.http.get<Food>(this.API_URL + 'food/villa', this.httpOptions);
    }

    getUserCanVote(): Observable<CanVote> {
        return this.http.get<CanVote>(this.API_URL + 'userCanVote', this.httpOptions);
    }

    getVotingIsAllowed(): Observable<VotingAllowed> {
        return this.http.get<VotingAllowed>(this.API_URL + 'votingIsAllowed', this.httpOptions);
    }

    getAnswerForUser(): Observable<Answer> {
        return this.http.get<Answer>(this.API_URL + 'selectedChoice', this.httpOptions);
    }

    getAllAnswers(): Observable<Answer[]> {
        return this.http.get<Answer[]>(this.API_URL + 'votes/1', this.httpOptions);
    }
}
