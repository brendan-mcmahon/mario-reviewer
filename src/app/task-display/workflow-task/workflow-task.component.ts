import { Component, OnInit, Input } from '@angular/core';
import { WorkflowTask, KeyValue } from 'src/app/history.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-workflow-task',
  templateUrl: './workflow-task.component.html',
  styleUrls: ['./workflow-task.component.css']
})
export class WorkflowTaskComponent implements OnInit {

  @Input() wfTask: WorkflowTask;
  public dataSource = new MatTableDataSource<KeyValue>();
  displayedColumns = ['key', 'value'];

  constructor() { }

  ngOnInit(): void {
    this.dataSource.data = this.wfTask.inputs;
  }

}
