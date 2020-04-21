import { Injectable } from '@angular/core';
import { Environment, DeployPhase, WorkflowTask, KeyValue, EnvironmentListComparison } from './history.model';

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

    this.processDeployPhases(beforeUnchangedEnvironments, afterUnchangedEnvironments);

    const result =  new EnvironmentListComparison(
      [...deletedEnvironments, ...editedBeforeEnvironments, ...unchangedEnvironments],
      [...addedEnvironments, ...editedAfterEnvironments, ...unchangedEnvironments]);

    console.log(result);

    return result;
  }

  private processDeployPhases(beforeUnchangedEnvironments: Environment[], afterUnchangedEnvironments: Environment[]) {
    beforeUnchangedEnvironments.forEach(be => {
      // get the matching 'after' environment;
      const ae = afterUnchangedEnvironments.filter(e => e.name === be.name)[0];

      let deletedDeployPhases = this.difference(be.deployPhases, ae.deployPhases, (a, b) => a.name === b.name);
      deletedDeployPhases = deletedDeployPhases.map(d => { d.status = 'deleted'; return d; });

      let addedDeployPhases = this.difference(ae.deployPhases, be.deployPhases, (a, b) => a.name === b.name);
      addedDeployPhases = addedDeployPhases.map(a => { a.status = 'added'; return a; });

      // let editedBeforeDeployPhases = this.intersect(be.deployPhases, ae.deployPhases, (a, b) => a.name === b.name && (a.name !== b.name));
      // editedBeforeDeployPhases = editedBeforeDeployPhases.map(e => { e.status = 'edited'; return e; });

      // let editedAfterDeployPhases = this.intersect(ae.deployPhases, be.deployPhases, (a, b) => a.name === b.name && (a.name !== b.name));
      // editedAfterDeployPhases = editedAfterDeployPhases.map(e => { e.status = 'edited'; return e; });

      const unchangedDeployPhases = this.intersect(be.deployPhases, ae.deployPhases, (a, b) => a.name === b.name);

      const coexistingDeployPhaseIds = [...unchangedDeployPhases].map(e => e.name);
      const beforeUnchangedDeployPhases = be.deployPhases.filter(dp => coexistingDeployPhaseIds.includes(dp.name));
      const afterUnchangedDeployPhases = ae.deployPhases.filter(dp => coexistingDeployPhaseIds.includes(dp.name));

      this.processWorkflowTasks(beforeUnchangedDeployPhases, afterUnchangedDeployPhases);

      be.deployPhases = [...deletedDeployPhases, ...unchangedDeployPhases];
      ae.deployPhases = [...addedDeployPhases, ...unchangedDeployPhases];
    });
  }

  private processWorkflowTasks(beforeUnchangedDeployPhases: DeployPhase[], afterUnchangedDeployPhases: DeployPhase[]) {
    beforeUnchangedDeployPhases.forEach(bdp => {
      // get the matching 'after' environment;
      const adp = afterUnchangedDeployPhases.filter(d => d.name === bdp.name)[0];

      let deletedWorkflowTasks = this.difference(bdp.workflowTasks, adp.workflowTasks, (a, b) => a.id === b.id);
      deletedWorkflowTasks = deletedWorkflowTasks.map(d => { d.status = 'deleted'; return d; });

      let addedWorkflowTasks = this.difference(adp.workflowTasks, bdp.workflowTasks, (a, b) => a.id === b.id);
      addedWorkflowTasks = addedWorkflowTasks.map(a => { a.status = 'added'; return a; });

      let editedBeforeWorkflowTasks = this.intersect(bdp.workflowTasks, adp.workflowTasks, (a, b) => a.id === b.id && (a.name !== b.name));
      editedBeforeWorkflowTasks = editedBeforeWorkflowTasks.map(e => { e.status = 'edited'; return e; });

      let editedAfterWorkflowTasks = this.intersect(adp.workflowTasks, bdp.workflowTasks, (a, b) => a.id === b.id && (a.name !== b.name));
      editedAfterWorkflowTasks = editedAfterWorkflowTasks.map(e => { e.status = 'edited'; return e; });

      const unchangedWorkflowTasks = this.intersect(bdp.workflowTasks, adp.workflowTasks, (a, b) => a.id === b.id && a.name === b.name);

      bdp.childStatus = (deletedWorkflowTasks.length < 0 || editedBeforeWorkflowTasks.length < 0) ? 'modified' : 'unchanged';
      adp.childStatus = (addedWorkflowTasks.length < 0 || editedAfterWorkflowTasks.length < 0) ? 'modified' : 'unchanged';

      const coexistingDeployPhaseIds = [...editedBeforeWorkflowTasks, ...unchangedWorkflowTasks].map(e => e.id);
      const beforeUnchangedWorkflowTasks = bdp.workflowTasks.filter(wft => coexistingDeployPhaseIds.includes(wft.id));
      const afterUnchangedWorkflowTasks = adp.workflowTasks.filter(wft => coexistingDeployPhaseIds.includes(wft.id));

      // this.processWorkflowTasks(beforeUnchangedWorkflowTasks, afterUnchangedWorkflowTasks);

      bdp.workflowTasks = [...deletedWorkflowTasks, ...editedBeforeWorkflowTasks, ...unchangedWorkflowTasks];
      adp.workflowTasks = [...addedWorkflowTasks, ...editedAfterWorkflowTasks, ...unchangedWorkflowTasks];
    });
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
