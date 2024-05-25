
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { HomeComponent } from '../home/home.component';
import { SignInComponent } from './sign-in.component';
import { AuthenticateService } from '../../shared/services/authenticate.service';
import { capitalizeFirstLetterWord, createTimer } from '../../shared/functions';
import { MESSAGE_STATUS } from '../../shared/components/snackbar/enums/snackbar';

const IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  SnackbarComponent,
  HttpClientTestingModule,
  RouterModule.forRoot([
    { path: 'profiles', component: HomeComponent }
  ])
];

describe('SignInComponent', () => {
  let component: SignInComponent;
  let authenticateService: AuthenticateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: AuthenticateService,
          useValue: {
            signIn: jest.fn(() => of({}))
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
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    authenticateService = TestBed.inject(AuthenticateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.signInForm).toBeDefined();
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
  });

  it('should correctly return the controls of signInForm', () => {
    const controls = component.formControls;
    const userFixture = {
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signInForm.patchValue(userFixture);

    expect(controls).toEqual(component.signInForm.controls);
  });

  it('should correctly return the getRawValue of signInForm', () => {
    const userFixture = {
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signInForm.patchValue(userFixture);

    expect(component.formRawValues).toEqual(userFixture);
  });

  it('should perform the submit', () => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const signInSpy = jest.spyOn(authenticateService, 'signIn');
    const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');

    const userFixture = {
      email: 'admin@gmail.com',
      password: 'Admin@123'
    };

    component.signInForm.patchValue(userFixture);

    component.onSubmit();

    createTimer(1000, () => {
      expect(onSubmitSpy).toHaveBeenCalled();
      expect(signInSpy).toHaveBeenCalledTimes(1);
      expect(signInSpy).toHaveBeenCalledWith(userFixture);
      expect(setItemSpy).toHaveBeenCalledTimes(1);
      expect(navigateByUrlSpy).toHaveBeenCalledWith('/profiles');
    });
  });


  it('should correctly perform the signIn, but an error occurred', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      birthdate: '1998-01-01'
    };
    const mockError = {
      "message": "Email is invalid.",
      "isError": true
    };
    const signInSpy = jest.spyOn(authenticateService, 'signIn')
                              .mockReturnValue(of(mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    authenticateService.signIn(userFixture).subscribe({
      next: ({ message, isError }: any) => {
        if (isError) {
          messageStatus = MESSAGE_STATUS.error;
          formStatus = [message && capitalizeFirstLetterWord(message)];
        }}
    });

    expect(signInSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Email is invalid.']);
  });

  it('should incorrectly perform the createUser', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      birthdate: '1998-01-01'
    };
    const mockError = {
      "error": {
        "message": ["email must be an email"]
      }
    };
    const signInSpy = jest.spyOn(authenticateService, 'signIn')
                              .mockReturnValue(throwError(() => mockError));
    let messageStatus!: MESSAGE_STATUS;
    let formStatus!: Array<string>;

    authenticateService.signIn(userFixture).subscribe({
      error: ({ error }) => {
        if (!error.message.length) return;
        messageStatus = MESSAGE_STATUS.error;
        formStatus = error.message.map((word: string) => capitalizeFirstLetterWord(word));
      }
    });

    expect(signInSpy).toHaveBeenCalled();
    expect(messageStatus).toEqual(MESSAGE_STATUS.error);
    expect(formStatus).toEqual(['Email must be an email']);
  });
});
