import { Injectable } from '@angular/core';
import { Variable, VariableListComparison } from './history.model';

@Injectable({
  providedIn: 'root'
})
export class VariableComparerService {

  constructor() { }

  compare(before: Variable[], after: Variable[]): VariableListComparison {
    let deletions = this.difference(before, after,  (a, b) => a.name === b.name && a.scope === b.scope);
    deletions = deletions.map(d => { d.status = 'deleted'; return d; });

    let additions = this.difference(after, before, (a, b) => a.name === b.name && a.scope === b.scope);
    additions = additions.map(a => this.setStatus(a, 'added'));

    let editedBefore = this.intersect(before, after, (a, b) => a.name === b.name && a.scope === b.scope && a.value !== b.value);
    editedBefore = editedBefore.map(e => this.setStatus(e, 'edited'));

    let editedAfter = this.intersect(after, before, (a, b) => a.name === b.name && a.scope === b.scope && a.value !== b.value);
    editedAfter = editedAfter.map(e => this.setStatus(e, 'edited'));

    const unchanged = this.intersect(before, after, (a, b) => a.name === b.name && a.scope === b.scope && a.value === b.value);

    const result =  new VariableListComparison([...deletions, ...editedBefore, ...unchanged], [...additions, ...editedAfter, ...unchanged]);

    console.log(result);

    return result;
  }

  private setStatus(v: Variable, status: string): Variable {
    v.status = status;
    return v;
  }

  private difference(listA: Variable[], listB: Variable[], predicate: (x: Variable, y: Variable) => boolean): Variable[] {
    return listA.filter(a => listB.filter(b => {
      return predicate(a, b);
    }).length === 0);
  }

  private intersect(listA: Variable[], listB: Variable[], predicate: (x: Variable, y: Variable) => boolean): Variable[] {
    return listA.filter(a => listB.filter(b => {
      return predicate(a, b);
    }).length > 0);
  }
}
