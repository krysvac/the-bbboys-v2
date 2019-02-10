import {Component, OnInit} from '@angular/core';
import {ApiService, UserService} from '../_services';
import {PollWithChoices} from '../types';
import * as moment from 'moment';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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

    constructor(public user: UserService, private api: ApiService) {
    }

    ngOnInit() {
        this.api.getPoll().subscribe(
            data => {
                this.pollWithChoices = data;
                this.pollLoaded = true;
            }
        );

        if (this.user.isLoggedIn()) {
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

        this.voteForm = new FormGroup({
            'choice': new FormControl('', [
                    Validators.required
                ]
            )
        });
    }

    public getDay() {
        return PollComponent.translateDay(moment().isoWeekday().toString());
    }

    public onSubmit() {

    }

    public static translateDay(day: string) {
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
}
