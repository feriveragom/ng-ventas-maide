import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isAuthenticated: boolean | null = false;

  @Output() logoutClicked = new EventEmitter<void>();

  onLogoutClick(): void {
    this.logoutClicked.emit();
  }
}
