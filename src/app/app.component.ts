import { Component } from '@angular/core';
import { HistoryDocument, Variable } from './history.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mario';
  fileText: string;
  history: HistoryDocument;
  something: any;

  public constructor() {

  }

  update() {
    console.log('updating...');
    if (this.fileText !== '') {
      const something = JSON.parse(this.fileText);

      console.log(something);

      this.history = new HistoryDocument();

      this.history.modifiedBy = something.modifiedBy.displayName;

      for (const i in something.variables) {
        this.history.variables.push(new Variable(i, something.variables[i].value));
      }

    // console.log(JSON.stringify(result));

    }
  }
}
