import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { getLocalStorage } from "../functions";
import { IProfile } from "../../components/profiles/interfaces/iprofile";

export const AuthorizationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const currentProfile: IProfile = JSON.parse(getLocalStorage('currentProfile') || '{}');

  if (currentProfile && currentProfile?.id && currentProfile?.name) {
    return true;
  } else {
    router.navigate(['/profiles']);
    return false;
  }
}
