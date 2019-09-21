import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../_services';
import {environment} from '../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private user: UserService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Logga ut' + environment.title);
  }

  ngOnInit() {
    this.user.setUserLoggedOut();
    this.router.navigate(['overview/']);
  }
}
