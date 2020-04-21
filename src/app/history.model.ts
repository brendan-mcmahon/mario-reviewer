export class HistoryDocument {
  modifiedBy: string;
  comment: string;
  modifiedDate: Date;
  variables: Variable[] = [];
  environments: Environment[] = [];
}

export class Person {
  name: string;
  email: string;
  imageUrl: string;
}

export class Variable {
  name: string;
  value: string;
  scope: string;
  status = 'unchanged';

  public constructor(name: string, value: string, scope: string) {
    this.name = name;
    this.value = value;
    this.scope = scope;
  }
}

export class VariableListComparison {
  before: Variable[];
  after: Variable[];

  public constructor(before: Variable[], after: Variable[]) {
    this.before = before;
    this.after = after;
  }
}

export class EnvironmentListComparison {
  before: Environment[];
  after: Environment[];

  public constructor(before: Environment[], after: Environment[]) {
    this.before = before;
    this.after = after;
  }
}

export class Environment {
  name: string;
  id: number;
  variables: Variable[] = [];
  deployPhases: DeployPhase[];
  status = 'unchanged';
  childStatus = 'unchanged';

  public constructor (name: string, id: number, deployPhases: DeployPhase[]) {
    this.name = name;
    this.id = id;
    this.deployPhases = deployPhases;
  }
}

export class DeployPhase {
  rank: number;
  name: string;
  // add artifacts download input
  workflowTasks: WorkflowTask[];
  status = 'unchanged';
  childStatus = 'unchanged';

  public constructor(name: string, workflowTasks: WorkflowTask[]) {
    this.name = name;
    this.workflowTasks = workflowTasks;
  }
}

export class WorkflowTask {
  version: string;
  name: string;
  id: number;
  enabled: boolean;
  inputs: KeyValue[];
  status = 'unchanged';
  childStatus = 'unchanged';

  public constructor(name: string, id: number, inputs: KeyValue[]) {
    this.name = name;
    this.inputs = inputs;
    this.id = id;
  }
}

export interface KeyValue {
  key: string;
  value: string;
  status: string;
}
