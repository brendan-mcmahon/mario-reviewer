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
    // console.log(`getting environment status ${env.status}`);
    return this.getStatus(env.status, env.childStatus);
  }

  getDeployPhaseStatusClass(phase: DeployPhase): string {
    // console.log(`getting phase status ${phase.status}`);
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
        console.log('this is added!');
        classString += 'green';
        break;
      case 'deleted':
        // console.log('this is deleted!');
        classString += 'red';
        break;
      case 'edited':
        // console.log('this is edited!');
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
