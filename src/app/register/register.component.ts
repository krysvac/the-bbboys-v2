import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, UserService} from '../_services';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {SettingsComponent} from '../settings/settings.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    public registerForm: FormGroup;
    public registerError: boolean = false;
    public registerErrorMsg: string = '';

    private readonly token: string;
    private validToken: boolean = false;
    private readonly passwordPattern: RegExp = new RegExp('^[a-zA-Z0-9åÅäÄöÖ!@#_.]+$');
    private readonly usernamePattern: RegExp = new RegExp('^[a-zA-Z0-9åÅäÄöÖ_]+$');

    constructor(private router: Router, private route: ActivatedRoute, private titleService: Title, private user: UserService,
                private api: ApiService) {
        this.token = this.route.snapshot.paramMap.get('token');
        this.titleService.setTitle('Registrera konto' + environment.title);
    }

    ngOnInit() {
        if (this.user.isLoggedIn()) {
            this.router.navigate(['overview/']);
        } else {
            this.api.validateToken({token: this.token}).subscribe(
                () => {
                    this.validToken = true;

                    this.registerForm = new FormGroup({
                        'username': new FormControl('', [
                            Validators.required,
                            Validators.minLength(2),
                            Validators.maxLength(32),
                            this.forbiddenUsernameValidator(this.usernamePattern)
                        ]),
                        'newPassword1': new FormControl('', [
                            Validators.required,
                            Validators.minLength(10),
                            Validators.maxLength(50),
                            this.forbiddenPasswordValidator(this.passwordPattern)
                        ]),
                        'newPassword2': new FormControl('', [
                            Validators.required,
                            Validators.minLength(10),
                            Validators.maxLength(50),
                            this.forbiddenPasswordValidator(this.passwordPattern)
                        ])
                    }, SettingsComponent.passwordMatchValidator);
                },
                () => {
                    this.router.navigate(['overview/']);
                }
            );
        }
    }

    get username(): AbstractControl {
        return this.registerForm.get('username');
    }

    get newPassword1(): AbstractControl {
        return this.registerForm.get('newPassword1');
    }

    get newPassword2(): AbstractControl {
        return this.registerForm.get('newPassword2');
    }

    public onSubmit(): void {
        if (this.registerForm.status === 'VALID') {
            let details: Object = {
                username: this.username.value,
                password: this.newPassword1.value,
                token: this.token
            };

            this.api.registerUser(details).subscribe(
                () => {
                    this.registerError = false;
                    let loginData: Object = {
                        username: this.username.value,
                        password: this.newPassword1.value
                    };
                    this.user.login(loginData).subscribe(
                        data => {
                            let response = JSON.parse(JSON.stringify(data));

                            this.user.setUserLoggedIn(details['username'], response['token'], response['admin']);
                            this.router.navigate(['overview/']);
                        }
                    );
                },
                err => {
                    this.registerError = true;
                    switch (err.error['status']) {
                        case '403_TOKEN_INVALID': {
                            this.validToken = false;
                            this.router.navigate(['overview/']);
                            break;
                        }
                        case '403_USERNAME_TAKEN': {
                            this.registerErrorMsg = 'Det valda användarnamnet är upptaget!';
                            break;
                        }
                        default: {
                            this.registerErrorMsg = 'Något gick fel. Försök igen!';
                            break;
                        }
                    }
                }
            );
        }
    }

    private forbiddenPasswordValidator(pattern: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const forbidden = pattern.test(control.value);
            return !forbidden ? {'forbiddenPassword': {value: control.value}} : null;
        };
    }

    private forbiddenUsernameValidator(pattern: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const forbidden = pattern.test(control.value);
            return !forbidden ? {'forbiddenUsername': {value: control.value}} : null;
        };
    }
}
