import { Component, OnInit } from '@angular/core';
import { LoaderService } from 'src/app/loader/loader.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public loaderService:LoaderService) { }

}
