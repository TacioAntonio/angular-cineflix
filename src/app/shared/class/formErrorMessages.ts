import { FormGroup } from "@angular/forms";

export class FormErrorMessages {
  nameFieldErrors = [
    { required: 'Username is required.' },
    { minlength: 'The username must be at least 3 characters long.' },
    { maxlength: 'Username cannot exceed 8 characters.' },
    { pattern: 'Username must contain only letters.' }
  ];

  get profilenameErrorMessages() {
    return this.nameFieldErrors;
  }

  get usernameErrorMessages() {
    return this.nameFieldErrors;
  }

  get emailErrorMessages() {
    return [
      { required: 'Email is required.' },
      { email: 'Invalid e-mail.' }
    ];
  }

  get passwordErrorMessages() {
    return [
      { required: 'Password is required.' },
      { minlength: 'The password must be at least 6 characters long.' },
      { maxlength: 'Username cannot exceed 12 characters.' },
      { pattern: 'The password must contain at least one lowercase letter, one uppercase letter, one number and one symbol.' }
    ];
  }

  get birthdateErrorMessages() {
    return [
      { required: 'Birthdate is required.' },
      { underage: 'You must be over 18 years old.' },
    ];
  }

  set groupErrorMessages(signInForm: FormGroup) {
    Object.keys(signInForm.controls).forEach(eachKey => {
      let formControl: any = signInForm.controls[eachKey];

      switch (eachKey) {
        case 'profilename':
          formControl['errorMessages'] = this.profilenameErrorMessages;
          break;
        case 'username':
          formControl['errorMessages'] = this.usernameErrorMessages;
          break;
        case 'email':
          formControl['errorMessages'] = this.emailErrorMessages;
          break;
        case 'password':
          formControl['errorMessages'] = this.passwordErrorMessages;
          break;
        case 'birthdate':
          formControl['errorMessages'] = this.birthdateErrorMessages;
          break;
        default:
          break;
      }
    });
  }
}
