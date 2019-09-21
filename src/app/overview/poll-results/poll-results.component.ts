import {Component, OnInit} from '@angular/core';
import {Choice} from '../../types';
import {ApiService} from '../../_services';
import {PollComponent} from '../poll/poll.component';
import {Answer} from '../../types/answer';
import {OverviewComponent} from '../overview.component';

@Component({
  selector: 'app-poll-results',
  templateUrl: './poll-results.component.html',
  styleUrls: ['./poll-results.component.scss'],
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
        (data) => {
          this.choices = data;
          this.initAnswers(this.choices);
          this.choicesLoaded = true;

          this.loadAnswers();
        }
    );

    PollComponent.getUserVotedEventEmitter().subscribe(
        () => {
          this.initAnswers(this.choices);
          this.loadAnswers();
        }
    );
  }

  private initAnswers(choices: Choice[]): void {
    for (const choice of choices) {
      this.answers[choice.id] = {
        amount: 0,
        percent: 0,
      };
    }
  }

  private countAnswerAmounts(answers: Answer[]): void {
    for (const answer of answers) {
      this.answers[answer.choice_id].amount++;
    }

    for (const answer of answers) {
      const percent = this.answers[answer.choice_id].amount / this.totalAmountOfAnswers;
      this.answers[answer.choice_id].percent = percent * 100;
    }
  }

  private loadAnswers() {
    this.api.getAllAnswers().subscribe(
        (data) => {
          this.totalAmountOfAnswers = data.length;

          if (this.totalAmountOfAnswers > 0) {
            this.countAnswerAmounts(data);
          }

          this.answersLoaded = true;
        },
        (err) => {
          if (err.error['status'] === '401_EXPIRED') {
            OverviewComponent.tokenExpiredEvent().emit(true);
          }
        }
    );
  }
}
