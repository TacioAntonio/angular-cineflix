import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../functions";

export const AuthenticateGuard: CanActivateFn = (route, state) => {
  if (!getToken()) { return inject(Router).createUrlTree(['/sign-in']); };

  const decodedToken: any = jwtDecode(getToken());
  const expirationTime: number = decodedToken?.exp * 1000;
  const currentTime: number = new Date().getTime();

  return (expirationTime > currentTime && decodedToken?.isAuth) || inject(Router).createUrlTree(['/sign-in']);
}
