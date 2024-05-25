import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar.component';
import { MESSAGE_STATUS } from './enums/snackbar';

const IMPORTS = [
  CommonModule
];

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have inputs', () => {
    const formStatus: string[] = ['Error 1', 'Error 2'];
    const messageStatus: MESSAGE_STATUS = MESSAGE_STATUS.success;

    component.formStatus = formStatus;
    component.messageStatus = messageStatus;

    expect(component.formStatus).toEqual(formStatus);
    expect(component.messageStatus).toEqual(messageStatus);
  });
});
