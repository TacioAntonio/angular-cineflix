import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

const IMPORTS = [CommonModule];

@Component({
  selector: 'app-base-modal',
  standalone: true,
  imports: [...IMPORTS],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss'
})
export class BaseModalComponent {
  @Input() title!: string;
  @Input() showModal = false;
  @Input() maxWidth = '300px';
  @Input() height = 'auto';
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  _closeModal() {
    this.closeModal.emit();
  }
}
