import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

const IMPORTS = [CommonModule];

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() customWidth = '32px';
  @Input() customHeight = '32px';
}
