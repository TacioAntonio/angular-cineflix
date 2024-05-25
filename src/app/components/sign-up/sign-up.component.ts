import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FormValidationsComponent } from "../../shared/components/form-validations/form-validations.component";
import { FormErrorMessages } from "../../shared/class/formErrorMessages";
import { ageValidator, capitalizeFirstLetterWord, createTimer } from "../../shared/functions";
import { UsersService } from "../../shared/services/users.service";
import { take } from "rxjs";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  FormValidationsComponent,
  SnackbarComponent
];

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: [UsersService]
})
export class SignUpComponent extends FormErrorMessages implements OnInit {
  signUpForm!: FormGroup;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;

  get formControls() {
    this.groupErrorMessages = this.signUpForm;

    return this.signUpForm.controls;
  }

  get formRawValues() {
    return this.signUpForm.getRawValue();
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      birthdate: ['', [
        Validators.required,
        ageValidator
      ]]
    });

    this.formControls;
  }


  fieldErrorMessages(field: string) {
    return (this.formControls[field] as any)['errorMessages'];
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  onSubmit() {
    this.usersService
        .createUser(this.formRawValues)
        .pipe(take(1))
        .subscribe({
          next: ({ message, isError }: any) => {
            this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
            this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'User registered successfully.'];
            this.hiddenSnackbar();
            this.signUpForm.reset();
          },
          error: ({ error }) => {
            if (!error.message.length) return;
            this.messageStatus = MESSAGE_STATUS.error;
            this.formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
            this.hiddenSnackbar();
          }
        });
  }
}
