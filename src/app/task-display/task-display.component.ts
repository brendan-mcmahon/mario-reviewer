import { Component, OnInit, Input } from '@angular/core';
import { Environment } from '../history.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-task-display',
  templateUrl: './task-display.component.html',
  styleUrls: ['./task-display.component.css']
})
export class TaskDisplayComponent implements OnInit {

  @Input() environments: Environment[];
  @Input() title: string;

  constructor() { }

  ngOnInit(): void {


  }

  debug(): void {
    console.log(this.environments);
  }
}
