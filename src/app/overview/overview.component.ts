import {Component, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {UserService} from '../_services';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
    public tokenExpired: boolean = false;

    private static tokenExpiredEventEmitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private titleService: Title, private user: UserService) {
        this.titleService.setTitle('Hem' + environment.title);
    }

    ngOnInit() {
        OverviewComponent.tokenExpiredEvent().subscribe(
            () => {
                this.tokenExpired = true;
                this.user.setUserLoggedOut();
            }
        );
    }

    ngOnDestroy(): void {
        this.tokenExpired = false;
    }

    public dismissTokenExpired(): void {
        this.tokenExpired = false;
    }

    public static tokenExpiredEvent(): EventEmitter<any> {
        return this.tokenExpiredEventEmitter;
    }
}
