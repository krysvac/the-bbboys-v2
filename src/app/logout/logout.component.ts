import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../_services';

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(private user: UserService, private router: Router) {
    }

    ngOnInit() {
        this.user.setUserLoggedOut();
        this.router.navigate(['overview/']);
    }

}
