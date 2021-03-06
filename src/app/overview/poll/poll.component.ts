import {Component, EventEmitter, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Choice, PollWithChoices} from '../../types';
import {ApiService, StorageService, UserService} from '../../_services';
import {OverviewComponent} from '../overview.component';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
  private static pollLoadedEvent: EventEmitter<Choice[]> = new EventEmitter<Choice[]>();
  private static userVotedEvent: EventEmitter<any> = new EventEmitter<any>();
  public pollWithChoices: PollWithChoices;
  public voteForm: FormGroup;
  public pollLoaded: boolean = false;
  public canVoteToday: boolean = true;
  public votingIsAllowed: boolean = true;
  public choiceVotedFor: number = -1;
  public voteError: boolean = false;
  public voteErrorMsg: string = '';

  constructor(public user: UserService, private api: ApiService, private storage: StorageService) {
  }

  public get choice(): AbstractControl {
    return this.voteForm.get('choice');
  }

  public static translateDay(day: string): string {
    switch (day) {
      case '1':
        return 'Måndag';
      case '2':
        return 'Tisdag';
      case '3':
        return 'Onsdag';
      case '4':
        return 'Torsdag';
      case '5':
        return 'Fredag';
      case '6':
        return 'Lördag';
      case '7':
        return 'Söndag';
    }
  }

  public static getPollLoadedEventEmitter(): EventEmitter<Choice[]> {
    return this.pollLoadedEvent;
  }

  public static getUserVotedEventEmitter(): EventEmitter<any> {
    return this.userVotedEvent;
  }

  ngOnInit(): void {
    this.api.getPoll().subscribe(
        (data) => {
          this.pollWithChoices = data;
          PollComponent.pollLoadedEvent.emit(data.choices);
          this.pollLoaded = true;
        }
    );

    if (this.user.isLoggedIn()) {
      if (this.storage.retrieve('auth_token') !== '') {
        this.api.getUserCanVote().subscribe(
            (data) => {
              this.canVoteToday = data.canVote;

              if (!data.canVote) {
                this.api.getAnswerForUser().subscribe(
                    (data) => this.choiceVotedFor = data.choice_id,
                    (err) => {
                      if (err.error['status'] === '401_EXPIRED') {
                        OverviewComponent.tokenExpiredEvent().emit(true);
                      }
                    }
                );
              }
            },
            (err) => {
              this.canVoteToday = false;

              if (err.error['status'] === '401_EXPIRED') {
                OverviewComponent.tokenExpiredEvent().emit(true);
              }
            }
        );

        this.api.getVotingIsAllowed().subscribe(
            (data) => this.votingIsAllowed = data.votingAllowed,
            (err) => {
              this.votingIsAllowed = false;

              if (err.error['status'] === '401_EXPIRED') {
                OverviewComponent.tokenExpiredEvent().emit(true);
              }
            }
        );
      }
    }

    this.voteForm = new FormGroup({
      'choice': new FormControl('', [
        Validators.required
      ]
      )
    });
  }

  public getDay(): string {
    return PollComponent.translateDay(moment().isoWeekday().toString());
  }

  public onSubmit(): void {
    const details: Object = <Object>{
      poll_id: this.pollWithChoices.poll.id,
      choice_id: this.choice.value
    };

    this.api.vote(details).subscribe(
        () => {
          this.canVoteToday = false;
          this.voteError = false;
          PollComponent.getUserVotedEventEmitter().emit(true);
        },
        (err) => {
          switch (err.error['status']) {
            case '401_ALREADY_VOTED': {
              this.voteError = true;
              this.voteErrorMsg = 'Du har redan röstat idag!';
              this.canVoteToday = false;
              this.voteForm.reset();
              this.api.getAnswerForUser().subscribe(
                  (data) => {
                    this.choiceVotedFor = data.choice_id;
                    PollComponent.getUserVotedEventEmitter().emit(true);
                  }
              );
              break;
            }
            case '401_EXPIRED': {
              OverviewComponent.tokenExpiredEvent().emit(true);
              break;
            }
            default: {
              this.voteError = true;
              this.voteErrorMsg = 'Ett oväntat fel har inträffat. Försök igen!';
              break;
            }
          }
        }
    );
  }
}
