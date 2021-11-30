import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('Confpassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('Confpassword').setErrors( {MatchPassword: true} )
        } else {
            return null
        }
    }
}