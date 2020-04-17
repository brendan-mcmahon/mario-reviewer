import { Component } from '@angular/core';
import { HistoryDocument, Variable } from './history.model';
import { MatDialog } from '@angular/material/dialog';
import { DocumentDialogComponent } from './document-dialog/document-dialog.component';
import { VariableComparerService } from './variable-comparer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mario';
  before: HistoryDocument;
  after: HistoryDocument;

  public constructor(public dialog: MatDialog, private variableComparer: VariableComparerService) { }

  openBeforeDialog(): void {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: '80vw',
      height: '80vh'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.before = result;
      if (this.before && this.after) {
        const comparisonResults = this.variableComparer.compare(this.before.variables, this.after.variables);
        this.before.variables = comparisonResults.before;
        this.after.variables = comparisonResults.after;
      }
    });
  }

  openAfterDialog(): void {
    const dialogRef = this.dialog.open(DocumentDialogComponent, {
      width: '80vw',
      height: '80vh'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.after = result;
      if (this.before && this.after) {
        const comparisonResults = this.variableComparer.compare(this.before.variables, this.after.variables);
        this.before.variables = comparisonResults.before;
        this.after.variables = comparisonResults.after;
      }
    });
  }
}
