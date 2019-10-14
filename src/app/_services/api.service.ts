import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {StorageService} from './storage.service';
import {CanVote, Choice, Food, PollWithChoices, SearchResponse, SearchResultMovie, SearchResultTv, VotingAllowed} from '../types';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {Answer, WeebAnswer} from '../types/answer';
import {UserService} from './user.service';
import {RegistrationLink} from '../types/registrationLink';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public httpOptions: {[key: string]: any} = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8'
    })
  };
  private readonly API_URL: string;
  private readonly MOVIEDB_API_URL: string;
  private readonly MOVIEDB_API_KEY: string;

  constructor(private http: HttpClient, private storage: StorageService, private user: UserService) {
    this.API_URL = environment.apiUrl + '/';
    this.MOVIEDB_API_URL = environment.movieDbApiUrl + '/';
    this.MOVIEDB_API_KEY = environment.movieDbApiKey;
  }

  public getPoll(): Observable<PollWithChoices> {
    return this.http.get<PollWithChoices>(this.API_URL + 'poll/1', this.httpOptions);
  }

  public getAllAnswers(): Observable<Answer[]> {
    return this.http.get<Answer[]>(this.API_URL + 'votes/1', this.httpOptions);
  }

  public getBistroJFood(): Observable<Food> {
    return this.http.get<Food>(this.API_URL + 'food/bistroj', this.httpOptions);
  }

  public getVillaFood(): Observable<Food> {
    return this.http.get<Food>(this.API_URL + 'food/villa', this.httpOptions);
  }

  public getUserCanVote(): Observable<CanVote> {
    return this.http.get<CanVote>(this.API_URL + 'userCanVote', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getVotingIsAllowed(): Observable<VotingAllowed> {
    return this.http.get<VotingAllowed>(this.API_URL + 'votingIsAllowed', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getAnswerForUser(): Observable<Answer> {
    return this.http.get<Answer>(this.API_URL + 'selectedChoice', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public vote(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'vote', JSON.stringify(obj), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getRegisterLinks(): Observable<RegistrationLink[]> {
    if (this.user.isAdmin()) {
      return this.http.get<RegistrationLink[]>(this.API_URL + 'registrationLinks', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.storage.retrieve('auth_token')
        })
      });
    }
  }

  public createRegisterLink(): Observable<any> {
    if (this.user.isAdmin()) {
      return this.http.post(this.API_URL + 'createLink', null, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
          'token': this.storage.retrieve('auth_token')
        })
      });
    }
  }

  public changePassword(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'changePassword', JSON.stringify(obj), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public validateToken(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'validateToken', JSON.stringify(obj), this.httpOptions);
  }

  public getMovieDBImageBaseUrl(): Observable<any> {
    const params: HttpParams = new HttpParams()
        .set('api_key', this.MOVIEDB_API_KEY);

    return this.http.get<SearchResponse<SearchResultMovie>>(this.MOVIEDB_API_URL + 'configuration', {
      headers: this.httpOptions.headers,
      params: params
    });
  }

  public searchForMovie(searchTerm: string): Observable<SearchResponse<SearchResultMovie>> {
    const params: HttpParams = new HttpParams()
        .set('query', searchTerm)
        .set('api_key', this.MOVIEDB_API_KEY);

    return this.http.get<SearchResponse<SearchResultMovie>>(this.MOVIEDB_API_URL + 'search/movie', {
      headers: this.httpOptions.headers,
      params: params
    });
  }

  public searchForTvShow(searchTerm: string): Observable<SearchResponse<SearchResultTv>> {
    const params: HttpParams = new HttpParams()
        .set('query', searchTerm)
        .set('api_key', this.MOVIEDB_API_KEY);

    return this.http.get<SearchResponse<SearchResultTv>>(this.MOVIEDB_API_URL + 'search/tv', {
      headers: this.httpOptions.headers,
      params: params
    });
  }

  public getWeebChoices(): Observable<Choice[]> {
    return this.http.get<Choice[]>(this.API_URL + 'currentWeebChoices', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public addWeebChoice(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'addWeebChoice', JSON.stringify(obj), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getWeebVotingAllowed(): Observable<VotingAllowed> {
    return this.http.get<VotingAllowed>(this.API_URL + 'weebVotingAllowed', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getWeebAnswersForUser(): Observable<WeebAnswer[]> {
    return this.http.get<WeebAnswer[]>(this.API_URL + 'weebAnswersForUser', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public voteWeeb(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'voteWeeb', JSON.stringify(obj), {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public getAllWeebAnswers(): Observable<WeebAnswer[]> {
    return this.http.get<WeebAnswer[]>(this.API_URL + 'allWeebAnswers', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'token': this.storage.retrieve('auth_token')
      })
    });
  }

  public registerUser(obj: Object): Observable<any> {
    return this.http.post(this.API_URL + 'register', JSON.stringify(obj), this.httpOptions);
  }
}
