import {Component, EventEmitter, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Choice, PollWithChoices} from '../../types';
import {ApiService, StorageService, UserService} from '../../_services';


@Component({
    selector: 'app-poll',
    templateUrl: './poll.component.html',
    styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {
    public pollWithChoices: PollWithChoices;
    public voteForm: FormGroup;

    public pollLoaded: boolean = false;
    public canVoteToday: boolean = true;
    public votingIsAllowed: boolean = true;
    public choiceVotedFor: number = -1;

    public voteError: boolean = false;
    public voteErrorMsg: string = '';

    private static pollLoadedEvent: EventEmitter<Choice[]> = new EventEmitter<Choice[]>();
    private static userVotedEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(public user: UserService, private api: ApiService, private storage: StorageService) {
    }

    ngOnInit() {
        this.api.getPoll().subscribe(
            data => {
                this.pollWithChoices = data;
                PollComponent.pollLoadedEvent.emit(data.choices);
                this.pollLoaded = true;
            }
        );

        if (this.user.isLoggedIn()) {
            if (this.storage.retrieve('auth_token') === '') {

            } else {
                this.api.getUserCanVote().subscribe(
                    data => {
                        this.canVoteToday = data.canVote;

                        if (!data.canVote) {
                            this.api.getAnswerForUser().subscribe(
                                data => this.choiceVotedFor = data.choice_id
                            );
                        }
                    }
                );

                this.api.getVotingIsAllowed().subscribe(
                    data => this.votingIsAllowed = data.votingAllowed
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

    get choice(): AbstractControl {
        return this.voteForm.get('choice');
    }

    public onSubmit(): void {
        let details = <Object>{
            poll_id: this.pollWithChoices.poll.id,
            choice_id: this.choice.value
        };

        this.api.vote(details).subscribe(
            () => {
                this.canVoteToday = false;
                this.voteError = false;
                PollComponent.getUserVotedEventEmitter().emit(true);
            },
            err => {
                this.voteError = true;
                switch (err.error['status']) {
                    case '401_ALREADY_VOTED': {
                        this.voteErrorMsg = 'Du har redan röstat idag!';
                        this.canVoteToday = false;
                        this.voteForm.reset();
                        this.api.getAnswerForUser().subscribe(
                            data => this.choiceVotedFor = data.choice_id
                        );
                        break;
                    }
                    case '401_EXPIRED': {
                        this.voteErrorMsg = 'Du har blivit utloggad på grund av inaktivitet. Var vänlig logga in igen!';
                        this.user.setUserLoggedOut();
                        break;
                    }
                    default: {
                        this.voteErrorMsg = 'Ett oväntat fel har inträffat. Försök igen!';
                        break;
                    }
                }
            }
        );
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
}
