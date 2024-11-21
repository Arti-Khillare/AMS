import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {
  @Input() userRole : any
  
  constructor() {}
  
}
