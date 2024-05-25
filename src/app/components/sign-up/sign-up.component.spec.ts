import { ActivatedRoute, RouterModule, convertToParamMap } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';
import { SignUpComponent } from './sign-up.component';
import { UsersService } from '../../shared/services/users.service';
import { createTimer } from '../../shared/functions';

const IMPORTS = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
  SnackbarComponent,
  HttpClientTestingModule
];

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let usersService: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(() => of({}))
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
    const fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    usersService = TestBed.inject(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    expect(component.signUpForm).toBeDefined();
    expect(component.formStatus).toEqual([]);
    expect(component.messageStatus).toBeUndefined();
  });

  it('should correctly return the controls of signUpForm', () => {
    const controls = component.formControls;
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      birthdate: '1998-01-01'
    };

    component.signUpForm.patchValue(userFixture);

    expect(controls).toEqual(component.signUpForm.controls);
  });

  it('should correctly return the getRawValue of signUpForm', () => {
    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      birthdate: '1998-01-01'
    };

    component.signUpForm.patchValue(userFixture);

    expect(component.formRawValues).toEqual(userFixture);
  });

  it('should perform the submit', () => {
    const onSubmitSpy = jest.spyOn(component, 'onSubmit');
    const createUserSpy = jest.spyOn(usersService, 'createUser');

    const userFixture = {
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'Admin@123',
      birthdate: '1998-01-01'
    };

    component.signUpForm.patchValue(userFixture);

    component.onSubmit();

    createTimer(1000, () => {
      expect(onSubmitSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalledTimes(1);
      expect(createUserSpy).toHaveBeenCalledWith(userFixture);
      expect(component['hiddenSnackbar']).toHaveBeenCalledTimes(1);
      expect(component.formRawValues).toEqual({
        username: '',
        email: '',
        password: '',
        birthdate: ''
      });
    });
  });
});
