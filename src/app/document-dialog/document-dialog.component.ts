import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { HistoryDocument, Variable } from '../history.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-document-dialog',
  templateUrl: './document-dialog.component.html',
  styleUrls: ['./document-dialog.component.css']
})
export class DocumentDialogComponent implements OnInit {

  documentLabel = 'Before';
  @Output() parseDocEvent = new EventEmitter<HistoryDocument>();
  fileText: string;
  constructor(public dialogRef: MatDialogRef<DocumentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  sendMessage() {
  }

  update() {
    console.log('updating...');

    if (this.fileText !== '') {
      const rawFile = JSON.parse(this.fileText);

      const history = new HistoryDocument();

      history.modifiedBy = rawFile.modifiedBy.displayName;
      history.comment = rawFile.comment;
      history.modifiedDate = rawFile.modifiedOn;

      // tslint:disable-next-line:forin
      for (const i in rawFile.variables) {
        history.variables.push(new Variable(i, rawFile.variables[i].value, 'all'));
      }

      rawFile.environments.forEach(env => {
        // tslint:disable-next-line:forin
        for (const i in env.variables) {
          history.variables.push(new Variable(i, env.variables[i].value, env.name));
        }
      });

      this.parseDocEvent.emit(history);

      this.dialogRef.close(history);

    }
  }
}
