import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  constructor(public user: UserService) {
  }

  ngOnInit() {
  }
}
