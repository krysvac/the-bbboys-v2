import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {environment} from '../../environments/environment';
import {ApiService, UserService} from '../_services';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {RegistrationLink} from '../types/registrationLink';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    public createRegisterLinkError: boolean = false;
    public createRegisterLinkErrorMsg: string = '';
    public registrationLinks: RegistrationLink[];

    private changePasswordForm: FormGroup;
    private readonly passwordPattern: RegExp = new RegExp('^[a-zA-Z0-9åÅäÄöÖ!@#_.]+$');

    constructor(private titleService: Title, private user: UserService, private api: ApiService) {
        this.titleService.setTitle('Inställningar' + environment.title);

        this.changePasswordForm = new FormGroup({
            'oldPassword': new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
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
    }

    ngOnInit() {
        if (this.user.isAdmin()) {
            this.api.getRegisterLinks().subscribe(
                data => this.registrationLinks = data
            );
        }
    }

    public onSubmit(): void {

    }

    public createRegisterLink(): void {

    }

    public copyRegisterLink(token: string): void {
        let link = window.location.origin + '/register?token=' + token;

        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = link;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);

        let x = document.getElementById('snackbar');
        x.className = 'show';
        setTimeout(function () {
            x.className = x.className.replace('show', '');
        }, 3000);
    }

    private static passwordMatchValidator(g: FormGroup): null | Object {
        return g.get('newPassword1').value === g.get('newPassword2').value
            ? null : {'mismatch': true};
    }

    private forbiddenPasswordValidator(pattern: RegExp): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            const forbidden = pattern.test(control.value);
            return !forbidden ? {'forbiddenPassword': {value: control.value}} : null;
        };
    }

}
