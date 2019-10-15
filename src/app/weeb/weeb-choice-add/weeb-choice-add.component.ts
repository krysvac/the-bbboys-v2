import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig, FormlyFormOptions} from '@ngx-formly/core';
import {SearchModel, SearchModelType, SearchResponse, SearchResultMovie, SearchResultTv} from '../../types';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {ApiService} from '../../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-weeb-choice-add',
  templateUrl: './weeb-choice-add.component.html',
  styleUrls: ['./weeb-choice-add.component.scss']
})
export class WeebChoiceAddComponent implements OnInit {
  public addChoiceForm: FormGroup = new FormGroup({});
  public model: Object = {};
  public searchedModel: SearchModel;
  public fields: FormlyFieldConfig[] = [
    {
      key: 'searchType',
      type: 'select',
      defaultValue: 'movie',
      templateOptions: {
        label: 'Välj söktyp',
        required: true,
        options: [
          {value: 'movie', label: 'Film'},
          {value: 'tvShow', label: 'Serie'}
        ]
      },
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled'
      }
    },
    {
      key: 'searchTerm',
      type: 'input',
      templateOptions: {
        label: 'Sökterm',
        placeholder: 'Zombie Land Saga',
        description: 'Alla tecken är tillåtna, max 50 tecken',
        required: true,
        pattern: /^.{1,50}$/
      },
      validation: {
        messages: {
          required: (error, field: FormlyFieldConfig): string => 'Du måste ha en sökterm!',
          pattern: (error, field: FormlyFieldConfig): string => `"${field.formControl.value}" är inte en giltig sökterm`
        }
      },
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled'
      }
    }
  ];
  public options: FormlyFormOptions = {
    formState: {
      disabled: true
    }
  };
  public searchResultsMovies: SearchResponse<SearchResultMovie> = undefined;
  public searchResultsTv: SearchResponse<SearchResultTv> = undefined;
  public isSearching: boolean = false;
  public imageBaseUrl: string;
  public SearchModelType: any = SearchModelType;
  public snackbarMessage: string = '';
  private alreadyAddedChoices: string[] = [];
  public votingAllowed: boolean = true;

  constructor(private titleService: Title, private api: ApiService) {
    this.titleService.setTitle('Lägg till weeb-alternativ' + environment.title);
  }

  ngOnInit(): void {
    this.api.getWeebVotingAllowed().subscribe((res) => {
      this.votingAllowed = res.votingAllowed;
      this.options.formState.disabled = !this.votingAllowed;

      this.api.getMovieDBImageBaseUrl().subscribe((data) => {
        this.imageBaseUrl = data['images']['secure_base_url'];
      });
    });
  }

  public onSubmit(model: Object): void {
    this.searchedModel = Object.assign({}, model as SearchModel);
    this.isSearching = true;
    if (this.searchedModel.searchType === SearchModelType.Movie) {
      this.api.searchForMovie(this.searchedModel.searchTerm).subscribe((data) => this.handleSearch(data, SearchModelType.Movie));
    } else if (this.searchedModel.searchType === SearchModelType.TVShow) {
      this.api.searchForTvShow(this.searchedModel.searchTerm).subscribe((data) => this.handleSearch(data, SearchModelType.TVShow));
    }
  }

  public getYear(date: string): string {
    const parsedDate: moment.Moment = moment(date);

    if (parsedDate.isValid()) {
      return parsedDate.year().toString();
    } else {
      return 'N/A';
    }
  }

  public alreadyAdded(id: number): boolean {
    return this.alreadyAddedChoices.includes(id.toString());
  }

  public addChoice(id: number, name: string, year: string): void {
    const details: Object = <Object>{
      value: id.toString(),
      name: year === 'N/A' ? name : name + ' (' + year + ')'
    };

    this.api.addWeebChoice(details).subscribe(() => {
      this.alreadyAddedChoices.push(id.toString());
      this.showSnackbar('Alternativ tillagt');
    });
  }

  private handleSearch(data: SearchResponse<SearchResultMovie> | SearchResponse<SearchResultTv>, type: SearchModelType): void {
    if (type === SearchModelType.Movie) {
      this.searchResultsMovies = data as SearchResponse<SearchResultMovie>;
    } else if (type === SearchModelType.TVShow) {
      this.searchResultsTv = data as SearchResponse<SearchResultTv>;
    }

    this.api.getWeebChoices().subscribe((choices) => {
      this.alreadyAddedChoices = [];
      for (const choice of choices) {
        this.alreadyAddedChoices.push(choice.value.toString());
      }
      this.isSearching = false;
    });
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
