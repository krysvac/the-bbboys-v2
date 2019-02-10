import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    constructor(private titleService: Title) {
        this.titleService.setTitle('Hem' + environment.title);
    }

    ngOnInit() {
    }
}
