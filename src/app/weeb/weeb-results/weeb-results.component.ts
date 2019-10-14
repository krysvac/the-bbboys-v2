import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../_services';
import {Choice, ChoiceAnswerAmount} from '../../types';
import {WeebVoteComponent} from '..';
import {WeebAnswer} from '../../types/answer';

@Component({
  selector: 'app-weeb-results',
  templateUrl: './weeb-results.component.html',
  styleUrls: ['./weeb-results.component.scss']
})
export class WeebResultsComponent implements OnInit {
  public loading: boolean = true;
  public choices: Choice[];
  public answers: ChoiceAnswerAmount[] = [];
  public totalAnswerAmount: number = 0;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.init();
    WeebVoteComponent.getUserVotedWeebEventEmitter().subscribe(
        () => {
          this.init();
        }
    );
  }

  private init(): void {
    this.api.getWeebChoices().subscribe((choices) => {
      this.choices = choices;
      this.initAnswers(this.choices);
      this.loadAnswers();
    });
  }

  private initAnswers(choices: Choice[]): void {
    for (const choice of choices) {
      this.answers[choice.value] = {
        amount: 0,
        percent: 0
      };
    }
  }

  private loadAnswers(): void {
    this.api.getAllWeebAnswers().subscribe(
        (data) => {
          if (data.length > 0) {
            this.countAnswerAmounts(data);
          }
          this.totalAnswerAmount = data.length;
          this.loading = false;
        }
    );
  }

  private countAnswerAmounts(answers: WeebAnswer[]): void {
    for (const answer of answers) {
      this.answers[answer.value].amount++;
    }

    for (const answer of answers) {
      const percent: number = this.answers[answer.value].amount / answers.length;
      this.answers[answer.value].percent = percent * 100;
    }
  }
}
