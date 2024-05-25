import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../constants';
import { IProfile } from '../../components/profiles/interfaces/iprofile';
import { getToken } from '../functions';

@Injectable()
export class ProfilesService {
  private readonly API_URL = API_URL;

  constructor(private readonly http: HttpClient) {}

  getProfilesById(id: string) {
    return this.http.get(`${this.API_URL}/profile?user_id="${id}"`, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }

  createProfile(token: string, body: IProfile) {
    return this.http.post(`${this.API_URL}/profile?user_token="${token}"`, body, {
      headers: {
        'authorization': `Bearer ${getToken()}`
      }
    });
  }
}
