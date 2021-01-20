import { Injectable } from '@angular/core';
import { Environment, DeployPhase, WorkflowTask, KeyValue, EnvironmentListComparison, DeployPhaseListComparison, WorkflowTaskListComparison } from './history.model';

@Injectable({
  providedIn: 'root'
})
export class TaskComparerService {

  constructor() { }

  compare(before: Environment[], after: Environment[]): EnvironmentListComparison {

    console.log('comparing tasks...');

    let deletedEnvironments = this.difference(before, after, (a, b) => a.id === b.id);
    deletedEnvironments = deletedEnvironments.map(d => { d.status = 'deleted'; return d; });

    let addedEnvironments = this.difference(after, before, (a, b) => a.id === b.id);
    addedEnvironments = addedEnvironments.map(a => { a.status = 'added'; return a; });

    let editedBeforeEnvironments = this.intersect(before, after, (a, b) => a.id === b.id && (a.name !== b.name));
    editedBeforeEnvironments = editedBeforeEnvironments.map(e => {e.status = 'edited'; return e; });

    let editedAfterEnvironments = this.intersect(after, before, (a, b) => a.id === b.id && (a.name !== b.name));
    editedAfterEnvironments = editedAfterEnvironments.map(e => {e.status = 'edited'; return e; });

    const unchangedEnvironments = this.intersect(before, after, (a, b) => a.id === b.id && a.name === b.name);

    const coexistingEnvironmentIds = [...editedBeforeEnvironments, ...unchangedEnvironments].map(e => e.id);
    const beforeUnchangedEnvironments = before.filter(b => coexistingEnvironmentIds.includes(b.id));
    const afterUnchangedEnvironments = after.filter(b => coexistingEnvironmentIds.includes(b.id));

    const unchangedEnvironmentsWithDeployPhaseChanges = this.processDeployPhases(beforeUnchangedEnvironments, afterUnchangedEnvironments);

    const result =  new EnvironmentListComparison(
      [...deletedEnvironments, ...editedBeforeEnvironments, ...unchangedEnvironmentsWithDeployPhaseChanges.before],
      [...addedEnvironments, ...editedAfterEnvironments, ...unchangedEnvironmentsWithDeployPhaseChanges.after]);

    return result;
  }

  // tslint:disable-next-line: max-line-length
  private processDeployPhases(beforeUnchangedEnvironments: Environment[], afterUnchangedEnvironments: Environment[]): EnvironmentListComparison {
    beforeUnchangedEnvironments.forEach(beforeEnvironment => {
      const afterEnvironment = afterUnchangedEnvironments.filter(e => e.name === beforeEnvironment.name)[0];

      if (afterEnvironment) {
        let deletedDeployPhases = this.difference(beforeEnvironment.deployPhases, afterEnvironment.deployPhases, (a, b) => a.name === b.name);
        deletedDeployPhases = deletedDeployPhases.map(d => { d.status = 'deleted'; return d; });

        let addedDeployPhases = this.difference(afterEnvironment.deployPhases, beforeEnvironment.deployPhases, (a, b) => a.name === b.name);
        addedDeployPhases = addedDeployPhases.map(a => { a.status = 'added'; return a; });

        const unchangedDeployPhases = this.intersect(beforeEnvironment.deployPhases, afterEnvironment.deployPhases, (a, b) => a.name === b.name);

        const coexistingDeployPhaseIds = [...unchangedDeployPhases].map(e => e.name);
        const beforeUnchangedDeployPhases = beforeEnvironment.deployPhases.filter(dp => coexistingDeployPhaseIds.includes(dp.name));
        const afterUnchangedDeployPhases = afterEnvironment.deployPhases.filter(dp => coexistingDeployPhaseIds.includes(dp.name));

        const unchangedDeployPhasesWithWorkflowTaskChanges = this.processWorkflowTasks(beforeUnchangedDeployPhases, afterUnchangedDeployPhases);

        beforeEnvironment.childStatus = (deletedDeployPhases.length > 0 || unchangedDeployPhasesWithWorkflowTaskChanges.before.some( a => a.childStatus === 'modified')) ? 'modified' : 'unchanged';
        afterEnvironment.childStatus = (addedDeployPhases.length > 0 || unchangedDeployPhasesWithWorkflowTaskChanges.after.some( a => a.childStatus === 'modified')) ? 'modified' : 'unchanged';

        beforeEnvironment.deployPhases = [...deletedDeployPhases, ...unchangedDeployPhasesWithWorkflowTaskChanges.before];
        afterEnvironment.deployPhases = [...addedDeployPhases, ...unchangedDeployPhasesWithWorkflowTaskChanges.after];
      }
    });

    return new EnvironmentListComparison(beforeUnchangedEnvironments, afterUnchangedEnvironments);
  }

  private processWorkflowTasks(beforeUnchangedDeployPhases: DeployPhase[], afterUnchangedDeployPhases: DeployPhase[]): DeployPhaseListComparison {
    beforeUnchangedDeployPhases.forEach(beforePhase => {
      const afterPhase = afterUnchangedDeployPhases.filter(d => d.name === beforePhase.name)[0];

      if (afterPhase) {

      let deletedWorkflowTasks = this.difference(beforePhase.workflowTasks, afterPhase.workflowTasks, (a, b) => a.name === b.name);
      deletedWorkflowTasks = deletedWorkflowTasks.map(d => { d.status = 'deleted'; return d; });

      let addedWorkflowTasks = this.difference(afterPhase.workflowTasks, beforePhase.workflowTasks, (a, b) => a.name === b.name);
      addedWorkflowTasks = addedWorkflowTasks.map(a => { a.status = 'added'; return a; });

      const unchangedWorkflowTasks = this.intersect(beforePhase.workflowTasks, afterPhase.workflowTasks, (a, b) => a.name === b.name);

      const coexistingWorkflowTaskIds = [...unchangedWorkflowTasks].map(e => e.name);
      const beforeUnchangedWorkflowTasks = beforePhase.workflowTasks.filter(wft => coexistingWorkflowTaskIds.includes(wft.name));
      const afterUnchangedWorkflowTasks = afterPhase.workflowTasks.filter(wft => coexistingWorkflowTaskIds.includes(wft.name));

      const unchangedWorkflowTasksWithInputChanges = this.processInputs(beforeUnchangedWorkflowTasks, afterUnchangedWorkflowTasks);

      beforePhase.childStatus = (deletedWorkflowTasks.length > 0 || unchangedWorkflowTasksWithInputChanges.before.some( a => a.childStatus === 'modified')) ? 'modified' : 'unchanged';
      afterPhase.childStatus = (addedWorkflowTasks.length > 0 || unchangedWorkflowTasksWithInputChanges.after.some( a => a.childStatus === 'modified')) ? 'modified' : 'unchanged';

      beforePhase.workflowTasks = [...deletedWorkflowTasks, ...unchangedWorkflowTasksWithInputChanges.before];
      afterPhase.workflowTasks = [...addedWorkflowTasks, ...unchangedWorkflowTasksWithInputChanges.after];
      }
    });

    return new DeployPhaseListComparison(beforeUnchangedDeployPhases, afterUnchangedDeployPhases);
  }

  // tslint:disable-next-line: max-line-length
  private processInputs(beforeUnchangedWorkflowTasks: WorkflowTask[], afterUnchangedWorkflowTasks: WorkflowTask[]): WorkflowTaskListComparison {
    beforeUnchangedWorkflowTasks.forEach(beforeTask => {
      const afterTask = afterUnchangedWorkflowTasks.filter(d => d.name === beforeTask.name)[0];

      if (afterTask) {

      let deletedInputs = this.difference(beforeTask.inputs, afterTask.inputs, (a, b) => a.key === b.key);
      deletedInputs = deletedInputs.map(d => { d.status = 'deleted'; return d; });

      let addedInputs = this.difference(afterTask.inputs, beforeTask.inputs, (a, b) => a.key === b.key);
      addedInputs = addedInputs.map(a => { a.status = 'added'; return a; });

      let editedBeforeInputs = this.intersect(beforeTask.inputs, afterTask.inputs, (a, b) => a.key === b.key && (a.value !== b.value));
      editedBeforeInputs = editedBeforeInputs.map(e => { e.status = 'edited'; return e; });

      let editedAfterInputs = this.intersect(afterTask.inputs, beforeTask.inputs, (a, b) => a.key === b.key && (a.value !== b.value));
      editedAfterInputs = editedAfterInputs.map(e => { e.status = 'edited'; return e; });

      const unchangedInputs = this.intersect(beforeTask.inputs, afterTask.inputs, (a, b) => a.key === b.key && a.value === b.value);

      beforeTask.childStatus = (deletedInputs.length > 0 || editedBeforeInputs.length > 0) ? 'modified' : 'unchanged';
      afterTask.childStatus = (addedInputs.length > 0 || editedAfterInputs.length > 0) ? 'modified' : 'unchanged';

      beforeTask.inputs = [...deletedInputs, ...editedBeforeInputs, ...unchangedInputs];
      afterTask.inputs = [...addedInputs, ...editedAfterInputs, ...unchangedInputs];
      }
    });

    return new WorkflowTaskListComparison(beforeUnchangedWorkflowTasks, afterUnchangedWorkflowTasks);
  }


  private difference(listA: any[], listB: any[], predicate: (x: any, y: any) => boolean): any[] {
    return listA.filter(a => listB.filter(b => {
      return predicate(a, b);
    }).length === 0);
  }

  private intersect(listA: any[], listB: any[], predicate: (x: any, y: any) => boolean): any[] {
    return listA.filter(a => listB.filter(b => {
      return predicate(a, b);
    }).length > 0);
  }
}
