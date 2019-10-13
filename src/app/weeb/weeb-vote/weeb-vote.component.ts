import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {SearchModel, SearchModelType, SearchResponse, SearchResultMovie, SearchResultTv} from '../../types';
import {Title} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {ApiService} from '../../_services';
import * as moment from 'moment';

@Component({
  selector: 'app-weeb-vote',
  templateUrl: './weeb-vote.component.html',
  styleUrls: ['./weeb-vote.component.scss']
})
export class WeebVoteComponent implements OnInit {
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
          required: (error, field: FormlyFieldConfig) => 'Du måste ha en sökterm!',
          pattern: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" is not a valid IP Address`
        }
      }
    }
  ];
  public searchResultsMovies: SearchResponse<SearchResultMovie> = undefined;
  public searchResultsTv: SearchResponse<SearchResultTv> = undefined;
  public isSearching: boolean = false;
  public imageBaseUrl: string;
  public SearchModelType: any = SearchModelType;

  constructor(private titleService: Title, private api: ApiService) {
    this.titleService.setTitle('Weeb-vote' + environment.title);
  }

  ngOnInit(): void {
    this.api.getMovieDBImageBaseUrl().subscribe((data) => {
      this.imageBaseUrl = data['images']['secure_base_url'];
    });
  }

  public onSubmit(model: Object) {
    this.searchedModel = Object.assign({}, model as SearchModel);
    this.isSearching = true;
    if (this.searchedModel.searchType === SearchModelType.Movie) {
      this.api.searchForMovie(this.searchedModel.searchTerm).subscribe((data) => {
        console.log(data);
        this.searchResultsMovies = data;
        this.isSearching = false;
      });
    } else if (this.searchedModel.searchType === SearchModelType.TVShow) {
      this.api.searchForTvShow(this.searchedModel.searchTerm).subscribe((data) => {
        console.log(data);
        this.searchResultsTv = data;
        this.isSearching = false;
      });
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

  public addItem(id: number): void {
    console.log(id);
  }
}
