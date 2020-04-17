import { Component, OnInit, Input } from '@angular/core';
import { HistoryDocument } from '../history.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() title: string;
  @Input() document: HistoryDocument;

  constructor() { }

  ngOnInit(): void {
  }

}
