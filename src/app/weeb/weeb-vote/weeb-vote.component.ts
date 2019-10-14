import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {FormGroup} from '@angular/forms';
import {ApiService, UserService} from '../../_services';
import {environment} from '../../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-weeb-vote',
  templateUrl: './weeb-vote.component.html',
  styleUrls: ['./weeb-vote.component.scss']
})
export class WeebVoteComponent implements OnInit {
  public weebVoteForm: FormGroup = new FormGroup({});
  public model: Object = {};
  public fields: FormlyFieldConfig[] = [
    {
      key: 'choices',
      type: 'multicheckbox',
      templateOptions: {
        label: 'Vad ska vi se?',
        required: true,
        options: []
      },
      expressionProperties: {
        // apply expressionProperty for disabled based on formState
        'templateOptions.disabled': 'formState.disabled'
      },
    }
  ];
  public options: FormlyFormOptions = {
    formState: {
      disabled: true
    }
  };
  private static userVotedWeebEvent: EventEmitter<any> = new EventEmitter<any>();
  public loading: boolean = true;
  public votingAllowed: boolean = true;
  public snackbarMessage: string = '';
  public hasChoices: boolean = false;

  constructor(public user: UserService, private api: ApiService, private titleService: Title) {
    this.titleService.setTitle('Weeb-vote' + environment.title);
  }

  ngOnInit(): void {
    this.api.getWeebChoices().subscribe((choices) => {
      const values: any[] = [];
      this.model['choices'] = {};
      for (const choice of choices) {
        values.push({key: choice.value, value: choice.name});
      }
      this.hasChoices = values.length > 0;
      this.fields[0].templateOptions.options = values;

      this.api.getWeebAnswersForUser().subscribe((answers) => {
        for (const answer of answers) {
          this.model['choices'][answer.value] = true;
        }

        this.api.getWeebVotingAllowed().subscribe((res) => {
          this.votingAllowed = res.votingAllowed;
          this.options.formState.disabled = !this.votingAllowed;
          this.loading = false;
        });
      });
    });
  }

  public static getUserVotedWeebEventEmitter(): EventEmitter<any> {
    return this.userVotedWeebEvent;
  }

  public onSubmit(model: Object): void {
    const values: string[] = [];

    for (const key of Object.keys(model['choices'])) {
      if (model['choices'][key] === true) {
        values.push(key);
      }
    }

    const details: Object = <Object>{
      choices: values
    };

    this.api.voteWeeb(details).subscribe(() => {
      WeebVoteComponent.userVotedWeebEvent.emit(true);
      this.showSnackbar('Rösterna sparades');
    });
  }

  public submitDisabled(): boolean {
    const keys: string[] = Object.keys(this.model['choices']);

    if (keys.length > 0) {
      for (const key of keys) {
        if (this.model['choices'][key] === true) {
          return false;
        }
      }
    } else {
      return true;
    }

    return true;
  }

  private showSnackbar(message: string): void {
    this.snackbarMessage = message;
    const x: HTMLElement = document.getElementById('snackbar');
    x.className = 'show';
    setTimeout(function() {
      x.className = x.className.replace('show', '');
    }, 3000);
  }
}
