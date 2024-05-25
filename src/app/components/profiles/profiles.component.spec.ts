import { ActivatedRoute, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { ProfilesService } from '../../shared/services/profiles.service';
import { MoviesService } from '../../shared/services/movies.service';
import { ProfilesComponent } from './profiles.component';
import { BaseModalComponent } from '../../shared/components/base-modal/base-modal.component';
import { FormValidationsComponent } from '../../shared/components/form-validations/form-validations.component';
import { capitalizeFirstLetterWord, createTimer, setLocalStorage } from '../../shared/functions';
import { FAKE_TOKEN } from '../../shared/fake-constants';
import { NUMBER_PROFILES_ALLOWED } from '../../shared/constants';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';

const IMPORTS = [
  CommonModule,
  RouterModule,
  BaseModalComponent,
  ReactiveFormsModule,
  FormValidationsComponent,
  SnackbarComponent,
  HttpClientTestingModule
];

describe('ProfilesComponent', () => {
  let component: ProfilesComponent;
  let profilesService: ProfilesService;
  let moviesService: MoviesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: ProfilesService,
          useValue: {
            getProfilesById: jest.fn(() => of({})),
            createProfile: jest.fn(() => of({}))
          }
        },
        {
          provide: MoviesService,
          useValue: {
            createEmptyWatchlist: jest.fn(() => of({}))
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject(convertToParamMap({})),
          },
        }
      ]
    }).compileComponents();

    setLocalStorage('token', FAKE_TOKEN);
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(ProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    profilesService = TestBed.inject(ProfilesService);
    moviesService = TestBed.inject(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.createProfileForm).toBeDefined();
    expect(component.profiles).toEqual([]);
    expect(component.numberProfileAllowed).toBe(NUMBER_PROFILES_ALLOWED);
    expect(component.showCreateProfile).toBeFalsy();
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
  });


  it('should correctly return the controls of createProfileForm', () => {
    const controls = component.formControls;
    const userFixture = {
      profilename: 'admin'
    };

    component.createProfileForm.patchValue(userFixture);

    expect(controls).toEqual(component.createProfileForm.controls);
  });

  it('should correctly return the getRawValue of createProfileForm', () => {
    const userFixture = {
      profilename: 'admin'
    };

    component.createProfileForm.patchValue(userFixture);

    expect(component.formRawValues).toEqual(userFixture);
  });


  it('should correctly return the toggleModalVisibility', () => {
    component.toggleModalVisibility();

    expect(component.showCreateProfile).toBeTruthy();
  });

  it('should perform the submit', () => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const createProfileSpy = jest.spyOn(profilesService, 'createProfile');

    const userFixture = {
      profilename: 'admin'
    };

    component.createProfileForm.patchValue(userFixture);

    component.onSubmit();

    createTimer(1000, () => {
      expect(onSubmitSpy).toHaveBeenCalled();
      expect(createProfileSpy).toHaveBeenCalledTimes(1);
      expect(createProfileSpy).toHaveBeenCalledWith(FAKE_TOKEN, userFixture);
      expect(component.formRawValues).toEqual({ profilename: '' });
      expect(component.messageStatus).toEqual(MESSAGE_STATUS.success);
      expect(component.formStatus).toEqual(['Profile registered successfully.']);
      console.log(component.messageStatus, component.formStatus)
    });
  });


  it('should correctly perform the createProfile, but an error occurred', () => {
    const userFixture = {
      name: 'admin'
    };
    const mockReturnValueUserFixture = {
      message: 'Invalid.',
      isError: true
    };
    const createProfileSpy = jest.spyOn(profilesService, 'createProfile')
                              .mockReturnValue(of(mockReturnValueUserFixture));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    profilesService.createProfile(FAKE_TOKEN, userFixture).subscribe({
      next: ({ message, isError }: any) => {
        messageStatus = isError ? MESSAGE_STATUS.error : MESSAGE_STATUS.success;
        formStatus = [message ? capitalizeFirstLetterWord(message) : 'Profile registered successfully.'];
        component.createProfileForm.reset();
      }
    });

    expect(createProfileSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Invalid. ']);
  });

  it('should incorrectly perform the createProfile', () => {
    const userFixture = {
      name: 'admin'
    };
    const mockError = {
      "error": {
        "message": ["Invalid."]
      }
    };
    const createProfileSpy = jest.spyOn(profilesService, 'createProfile')
                                  .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    profilesService.createProfile(FAKE_TOKEN, userFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
      }
    });

    expect(createProfileSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Invalid. ']);
  });
});
