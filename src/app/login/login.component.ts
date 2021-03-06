import {Component, OnInit} from '@angular/core';
import {UserService} from '../_services';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loginError: boolean = false;
  public loginErrorMsg: string = '';

  constructor(private user: UserService, private router: Router, private titleService: Title) {
    this.titleService.setTitle('Logga in' + environment.title);
  }

  public get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  public get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    if (this.user.isLoggedIn()) {
      this.router.navigate(['overview/']);
    } else {
      this.loginForm = new FormGroup({
        'username': new FormControl('', [
          Validators.required,
          Validators.maxLength(50)
        ]),
        'password': new FormControl('', [
          Validators.required,
          Validators.maxLength(50)
        ])
      });
    }
  }

  public onSubmit(): void {
    const details: Object = <Object>{
      username: this.username.value,
      password: this.password.value
    };

    this.user.login(details).subscribe(
        (data) => {
          const response: any[] = JSON.parse(JSON.stringify(data));

          this.user.setUserLoggedIn(details['username'], response['token'], response['admin']);
          this.router.navigate(['overview/']);
        },
        (err) => {
          this.loginError = true;
          switch (err.error['status']) {
            case '401_LOGIN': {
              this.loginErrorMsg = 'Fel användarnamn eller lösenord!';
              break;
            }
            default: {
              this.loginErrorMsg = 'Ett oväntat fel har inträffat. Försök igen!';
              break;
            }
          }
        }
    );
  }
}
