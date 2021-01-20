import { Component, OnInit, Input } from '@angular/core';
import { Environment, DeployPhase, WorkflowTask } from '../history.model';

@Component({
  selector: 'app-task-display',
  templateUrl: './task-display.component.html',
  styleUrls: ['./task-display.component.css']
})
export class TaskDisplayComponent {

  @Input() environments: Environment[];
  @Input() title: string;

  constructor() { }

  getEnvironmentStatusClass(env: Environment): string {
    return this.getStatus(env.status, env.childStatus);
  }

  getDeployPhaseStatusClass(phase: DeployPhase): string {
    return this.getStatus(phase.status, phase.childStatus);
  }

  getWorkflowTaskStatusClass(wfTask: WorkflowTask): string {
    return this.getStatus(wfTask.status, wfTask.childStatus);
  }

  getEnabledStatusClass(wfTask: WorkflowTask): string {
    return wfTask.enabled ? '' : 'disabled';
  }

  private getStatus(status: string, childStatus: string) {
    let classString = childStatus === 'modified' ? 'yellow-border ' : '';
    switch (status) {
      case 'added':
        classString += 'green';
        break;
      case 'deleted':
        classString += 'red';
        break;
      case 'edited':
        classString += 'blue';
        break;
      default:
        classString += 'gray';
        break;
    }
    return classString;
  }

  debug(): void {
    console.log(this.environments);
  }
}
