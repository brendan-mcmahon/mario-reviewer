import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Variable } from '../history.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

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
  scopeFilterControl = new FormControl();
  scopes: string[];

  displayedColumns = ['name', 'value', 'scope'];

  statusFilters = ['added', 'deleted', 'edited', 'unchanged'];
  scopeFilters = [];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addStatusFilter(status: string) {
    this.statusFilters.push(status);

    this.applyFilters();
  }

  removeStatusFilter(status: string) {
    this.statusFilters = this.statusFilters.filter(f => f !== status);

    this.applyFilters();
  }

  toggleAllScopes(event: Event) {
    if (this.scopeFilters.length === 0) {
      this.scopeFilters = this.variables.map(v => v.scope).filter((v, i, a) => a.indexOf(v) === i);
    } else {
      this.scopeFilters = [];
    }

    this.applyFilters();
  }

  applyFilters() {
    const listCopy = [...this.variables];
    this.dataSource.data = listCopy
      .filter(v => this.statusFilters.includes(v.status))
      .filter(v => this.scopeFilters.includes(v.scope))
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
    this.scopes = this.variables.map(v => v.scope).filter((v, i, a) => a.indexOf(v) === i);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  constructor() { }
}
