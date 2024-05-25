import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormValidationsComponent } from '../form-validations/form-validations.component';
import { FormControl } from '@angular/forms';

const IMPORTS = [CommonModule];

describe('FormValidationsComponent', () => {
  let component: FormValidationsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...IMPORTS]
    }).compileComponents();
  });

  beforeEach(() => {
    const fixture = TestBed.createComponent(FormValidationsComponent);
    component = fixture.componentInstance;

    component.field = new FormControl('default value');

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should that the attributes have been initialized correctly', () => {
    component.messages = [{ password: 'Password is invalid.' }];

    expect(component.messages).toEqual([{ password: 'Password is invalid.' }]);
  });

  it('should perform the hasErrors and return true', () => {
    jest.spyOn(component, 'hasErrors').mockReturnValue(true)

    component.field.setValue('');
    component.field.markAsDirty();
    component.field.markAsTouched();
    const result = component.hasErrors(component.field);

    expect(result).toBeTruthy();
  });

  it('should perform the hasErrors and return false', () => {
    jest.spyOn(component, 'hasErrors').mockReturnValue(false);

    const result = component.hasErrors(component.field);

    expect(result).toBeFalsy();
  });

  it('should perform the getErrors and not return undefined', () => {
    jest.spyOn(component, 'getErrors');

    const result = component.getErrors(component.field);

    expect(result).toBeUndefined();
  });
});
