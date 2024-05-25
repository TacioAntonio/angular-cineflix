import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getLocalStorage } from "../../functions";

const IMPORTS = [
  CommonModule,
  RouterModule
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  get currentProfileId(): any {
    return JSON.parse(getLocalStorage('currentProfile') || '')?.id;
  }

  get currentProfileName(): any {
    return JSON.parse(getLocalStorage('currentProfile') || '')?.name;
  }
}
