import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { IValidationMessage } from "./interfaces";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-form-validations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-validations.component.html',
  styleUrl: './form-validations.component.scss',
})
export class FormValidationsComponent {
  @Input({ required: true }) field!: AbstractControl | any;
  @Input({ required: true }) messages!: IValidationMessage[];

  hasErrors(field: AbstractControl): boolean {
    return field.invalid && (field.dirty || field.touched);
  }

  getErrors(field: AbstractControl): IValidationMessage[] {
    return this.messages?.filter(message => field?.errors?.[Object.keys(message)?.[0]]);
  }
}
