import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NUMBER_PROFILES_ALLOWED } from "../../shared/constants";
import { RouterModule } from "@angular/router";
import { BaseModalComponent } from "../../shared/components/base-modal/base-modal.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormErrorMessages } from "../../shared/class/formErrorMessages";
import { FormValidationsComponent } from "../../shared/components/form-validations/form-validations.component";
import { ProfilesService } from "../../shared/services/profiles.service";
import { jwtDecode } from "jwt-decode";
import { capitalizeFirstLetterWord, createTimer, getToken, setLocalStorage } from "../../shared/functions";
import { take } from "rxjs";
import { IProfile } from "./interfaces/iprofile";
import { MESSAGE_STATUS } from "../../shared/components/snackbar/enums/snackbar";
import { SnackbarComponent } from "../../shared/components/snackbar/snackbar.component";
import { MoviesService } from "../../shared/services/movies.service";

const IMPORTS = [
  CommonModule,
  RouterModule,
  BaseModalComponent,
  ReactiveFormsModule,
  FormValidationsComponent,
  SnackbarComponent
];

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.scss',
  providers: [ProfilesService, MoviesService]
})
export class ProfilesComponent extends FormErrorMessages implements OnInit {
  createProfileForm!: FormGroup;
  profiles: Array<IProfile> = [];
  numberProfileAllowed = NUMBER_PROFILES_ALLOWED;
  showCreateProfile = false;
  formStatus: Array<string> = [];
  messageStatus!: MESSAGE_STATUS;

  get checkIfCanCreateProfile() {
    return this.profiles.length < 4;
  }

  get formControls() {
    this.groupErrorMessages = this.createProfileForm;

    return this.createProfileForm.controls;
  }

  get formRawValues() {
    return this.createProfileForm.getRawValue();
  }

  get user(): any {
    return jwtDecode(getToken());
  }

  set currentProfile(profile: any) {
    setLocalStorage('currentProfile', JSON.stringify(profile));
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly profilesService: ProfilesService,
    private readonly moviesService: MoviesService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createProfileForm = this.formBuilder.group({
      profilename: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8),
        Validators.pattern(/^[a-zA-Z]+$/)
      ]],
    });

    this.formControls;

    this.getProfilesById(this.user.id);
  }

  toggleModalVisibility() {
    this.showCreateProfile = !this.showCreateProfile;
  }

  fieldErrorMessages(field: string) {
    return (this.formControls[field] as any)['errorMessages'];
  }

  private getProfilesById(id: string) {
    this.profilesService
        .getProfilesById(id)
        .pipe(take(1))
        .subscribe((data: any) => {
          this.profiles = [];
          data.forEach(({ id, name }: IProfile) => {
            this.profiles.push({ id, name });
          });
        });
  }

  private createEmptyWatchlist(perfilId: string) {
    this.moviesService
        .createEmptyWatchlist(perfilId)
        .pipe(take(1))
        .subscribe(() => {})
  }

  private hiddenSnackbar() {
    createTimer(5000, () => this.formStatus = []);
  }

  onSubmit() {
    const profile = { name: this.formRawValues.profilename };

    this.profilesService
        .createProfile(getToken(), profile)
        .pipe(take(1))
        .subscribe({
          next: ({ id, message, isError }: any) => {
            this.messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
            this.formStatus = [message ? capitalizeFirstLetterWord(message) : 'Profile registered successfully.'];
            this.hiddenSnackbar();
            this.createProfileForm.reset();
            this.createEmptyWatchlist(id);
            this.getProfilesById(this.user.id);
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
