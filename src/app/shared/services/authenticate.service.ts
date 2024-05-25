import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { IUser } from '../interfaces/iuser';

@Injectable()
export class AuthenticateService {
  private readonly API_URL = API_URL;

  constructor(private readonly http: HttpClient) {}

  signIn(body: IUser) {
    return this.http.post(`${this.API_URL}/sign-in`, body);
  }
}
