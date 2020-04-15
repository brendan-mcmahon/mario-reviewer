export class HistoryDocument {
  modifiedBy: string;
  variables: Variable[] = [];
}

export class Person {
  name: string;
  email: string;
  imageUrl: string;
}

export class Variable {
  name: string;
  value: string;

  public constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }
}
