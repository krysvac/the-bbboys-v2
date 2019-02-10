import {Component, OnInit} from '@angular/core';
import {Choice} from '../../types';
import {ApiService} from '../../_services';
import {PollComponent} from '../poll/poll.component';
import {Answer} from '../../types/answer';

@Component({
    selector: 'app-poll-results',
    templateUrl: './poll-results.component.html',
    styleUrls: ['./poll-results.component.scss']
})
export class PollResultsComponent implements OnInit {
    public choices: Choice[];
    public answers: Object = {};
    public totalAmountOfAnswers: number;
    public choicesLoaded: boolean = false;
    public answersLoaded: boolean = false;

    constructor(private api: ApiService) {
    }

    ngOnInit() {
        PollComponent.getPollLoadedEventEmitter().subscribe(
            data => {
                this.choices = data;
                this.initAnswers(data);
                this.choicesLoaded = true;

                this.api.getAllAnswers().subscribe(
                    data => {
                        this.totalAmountOfAnswers = data.length;

                        if (this.totalAmountOfAnswers > 0) {
                            this.countAnswerAmounts(data);
                        }

                        this.answersLoaded = true;
                    }
                );
            }
        );
    }

    private initAnswers(choices: Choice[]): void {
        for (let choice of choices) {
            if (!this.answers[choice.id]) {
                this.answers[choice.id] = {
                    amount: 0,
                    percent: 0
                };
            }
        }
    }

    private countAnswerAmounts(answers: Answer[]): void {
        for (let answer of answers) {
            this.answers[answer.choice_id].amount++;
        }

        for (let answer of answers) {
            let percent = this.answers[answer.choice_id].amount / this.totalAmountOfAnswers;
            let percent_friendly = percent * 100;
            this.answers[answer.choice_id].percent = percent_friendly;
        }
    }
}
