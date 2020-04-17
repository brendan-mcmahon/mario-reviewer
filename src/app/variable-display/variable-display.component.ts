import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Variable } from '../history.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-variable-display',
  templateUrl: './variable-display.component.html',
  styleUrls: ['./variable-display.component.css']
})
export class VariableDisplayComponent implements OnInit, AfterViewInit {

  @Input() variables: Variable[];
  @ViewChild(MatSort) sort: MatSort;

  public dataSource = new MatTableDataSource<Variable>();

  filterText: string;

  displayedColumns = ['name', 'value', 'scope'];

  statusFilters = ['added', 'deleted', 'edited', 'unchanged'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStatusFilter(status: string) {
    this.statusFilters.push(status);

    this.applyStatusFilters();
  }

  removeStatusFilter(status: string) {
    this.statusFilters = this.statusFilters.filter(f => f !== status);

    this.applyStatusFilters();
  }

  private applyStatusFilters() {
    const listCopy = [...this.variables];
    this.dataSource.data = listCopy
      .filter(v => this.statusFilters
        .includes(v.status))
      .sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
  }


  getStatusClass(v: Variable) {
    if (v.status === 'deleted') {
      return 'red';
    } else if (v.status === 'edited') {
      return 'blue';
    } else if (v.status === 'added') {
      return 'green';
    }
  }

  ngOnInit() {
    this.dataSource.data = this.variables;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  constructor() { }
}
