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

export class Environment {
  name: string;
  variables: Variable[] = [];
}
