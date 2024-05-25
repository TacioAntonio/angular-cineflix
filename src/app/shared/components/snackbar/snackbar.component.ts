import { Component, Input } from "@angular/core";
import { MESSAGE_STATUS } from "./enums/snackbar";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  @Input({ required: true }) formStatus: Array<string> = [];
  @Input({ required: true }) messageStatus!: MESSAGE_STATUS;
}
