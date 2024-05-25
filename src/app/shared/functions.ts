import { AbstractControl, ValidationErrors } from "@angular/forms";
import { timer } from "rxjs";

export function ageValidator(control: AbstractControl): ValidationErrors | null {
  const birthdate = new Date(control.value);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  const dayDifference = today.getDate() - birthdate.getDate();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && dayDifference < 0)
  ) {
    age--;
  }

  return age >= 18 ? null : { underage: true };
}

export const capitalizeFirstLetterWord = (orignalWord: string) => {
  const wordDivision = orignalWord.split(' ');
  const firstWord: string | any = wordDivision.shift();
  const wordCapitalize = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  return `${wordCapitalize} ${wordDivision.map((word: string) => word.toLowerCase()).join(' ')}`;
}

export const createTimer = (timerInMilliseconds: number, action: Function) => {
  const snackbarTime = timerInMilliseconds;
  timer(snackbarTime).subscribe(_ => action());
}

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
}

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
}

export const deleteLocalStorage = (key: string) => {
  localStorage.removeItem(key);
}

export const getToken = (): any => {
  return getLocalStorage('token');
}
