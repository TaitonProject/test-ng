import { Component, OnInit } from '@angular/core';
import {Cl} from '../types/cl';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(){
    console.log("Cl", Cl);
  }
}
