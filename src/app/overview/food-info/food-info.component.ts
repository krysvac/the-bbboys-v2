import {Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Food} from '../../types';
import {ApiService} from '../../_services';

@Component({
  selector: 'app-food-info',
  templateUrl: './food-info.component.html',
  styleUrls: ['./food-info.component.scss']
})
export class FoodInfoComponent implements OnInit {
  public bistroJ: Food;
  public villa: Food;

  public bistroJDone: boolean = false;
  public villaDone: boolean = false;

  private tabStatus: Object = {};

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.getBistroJFood().subscribe(
        (data) => {
          this.bistroJ = data;
          this.toggleOpen('#bistroJ' + moment().isoWeekday().toString());
          this.bistroJDone = true;
        }
    );

    this.api.getVillaFood().subscribe(
        (data) => {
          this.villa = data;
          this.toggleOpen('#villa' + moment().isoWeekday().toString());
          this.villaDone = true;
        }
    );
  }

  public getWeek(): number {
    return moment().isoWeek();
  }

  public foodItemIsForToday(key: string): boolean {
    return key.toString() === moment().isoWeekday().toString();
  }

  public translateDay(day: string): string {
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

  public toggleOpen(key: string): void {
    if (this.tabStatus[key]) {
      this.tabStatus[key] = !this.tabStatus[key];
    } else {
      this.tabStatus[key] = true;
    }
  }

  public shouldBeOpen(prefix: string, key: string): boolean {
    if (this.tabStatus[prefix + key]) {
      return this.tabStatus[prefix + key];
    } else {
      return false;
    }
  }

  public unknownToStringArr(value: unknown): string[] {
    return value as string[];
  }
}
