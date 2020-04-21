import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { HistoryDocument, Variable, Environment, DeployPhase, WorkflowTask, KeyValue } from '../history.model';
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
    if (this.fileText && this.fileText !== '') {
      const rawFile = JSON.parse(this.fileText);

      const history = new HistoryDocument();

      history.modifiedBy = rawFile.modifiedBy.displayName;
      history.comment = rawFile.comment;
      history.modifiedDate = rawFile.modifiedOn;

      rawFile.environments.forEach(environment => {
        const phases: DeployPhase[] = [];
        environment.deployPhases.forEach(dp => {
          const wfTasks: WorkflowTask[] = [];
          dp.workflowTasks.forEach(wfTask => {
            const inputs: KeyValue[] = [];
            // tslint:disable-next-line:forin
            for (const i in wfTask.inputs) {
              inputs.push({ key: i, value: wfTask.inputs[i], status: 'unchanged'});
            }
            wfTasks.push(new WorkflowTask(wfTask.name, wfTask.taskId, inputs));
          });
          phases.push(new DeployPhase(dp.name, wfTasks));
        });
        history.environments.push(new Environment(environment.name, parseInt(environment.id, 10), phases));
      });

      this.extractVariables(rawFile, history);

      this.parseDocEvent.emit(history);

      this.dialogRef.close(history);

    }
  }

  private extractVariables(rawFile: any, history: HistoryDocument) {
      // tslint:disable-next-line:forin
    for (const i in rawFile.variables) {
      history.variables.push(new Variable(i, rawFile.variables[i].value, 'Release'));
    }
    rawFile.environments.forEach(env => {
      // tslint:disable-next-line:forin
      for (const i in env.variables) {
        history.variables.push(new Variable(i, env.variables[i].value, env.name));
      }
    });
  }
}
