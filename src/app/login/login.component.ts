import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private user: UserService, private router: Router) {
    }

    ngOnInit() {
        if (this.user.isLoggedIn()) {
            this.router.navigate(['overview/']);
        }
    }

}
