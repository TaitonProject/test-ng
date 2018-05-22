import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { AppState } from './../store/appState';
import { INCREMENT, DECREMENT } from '../store/countReducer';
import { ITreeNode } from '../tree-view/tree-view.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  num$: Observable<number>;
  data: Observable<any>;
  allData: Observable<Array<any>>;
  arrayPath = ['D^games', 'C^program^ios', 'C^music^depeche mode', 'C^program^bios'];
  paths = [
    { path: '/' },
    { path: 'A' },
    { path: 'A.A' },
    { path: 'A.B' },
    { path: 'A.C' },
    { path: 'A.D.C' },
    { path: 'B' },
    { path: 'C' }
  ];
  result: any;
  nodes: Array<ITreeNode> = [
    {
      id: 1, name: '1', children: [
        {
          id: 12, name: '1.1', children: [{
            id: 2, name: '1.1.1',
            children: [], isExpanded: true, selected: true
          }], isExpanded: true, selected: true
        }],
      isExpanded: true, selected: true
    }, { id: 13, name: '2', children: [], isExpanded: true, selected: true }];

  constructor(private store: Store<AppState>, private http: HttpClient) { }

  ngOnInit() {
    this.num$ = this.store.select('count');
    this.getAllTodo();
    this.callCreateTree(this.arrayPath, '^');
  }

  callCreateTree(arr: Array<string>, separator: string) {
    const self = this;
    this.result = arr.reduce(function (carry, pathEntry) {
      // On every path entry, resolve using the base object
      self.resolvePath(carry, pathEntry, separator);
      // Return the base object for suceeding paths, or for our final value
      return carry;
      // Create our base object
    }, self.createPath());
    console.log('result', this.result);
  }

  // Move out or template into a creator function.
  createPath() {
    return {
      child: []
    };
  }

  // Resolves the path into objects iteratively (but looks eerily like recursion).
  resolvePath(root, path, separator: string) {
    const self = this;
    path.split(separator).reduce(function (pathObject, pathName) {
      // For each path name we come across, use the existing or create a subpath
      // pathObject.child[pathName] = pathObject.child[pathName] || self.createPath();
      console.log('pathObject', pathObject);
      console.log('pathName', pathName);
      /* if (pathObject.child) {
        pathObject[pathName].child.push(pathName);
      } else {
        pathObject.child = [];
        pathObject.child.push(pathName);
      } */
      // pathObject.child.push(pathObject.child[pathName] || self.createPath());
      // Then return that subpath for the next operation
      return pathObject.child ? pathObject.child : pathObject;
      // Use the passed in base object to attach our resolutions
    }, root);
  }


  increment() {
    this.store.dispatch({ type: INCREMENT });
  }

  decrement() {
    this.store.dispatch({ type: DECREMENT });
    this.loadData();
  }

  loadData() {
    this.data = this.http.get<any>('http://localhost:5000/api/todo/1');
  }

  getAllTodo() {
    this.allData = this.http.get<Array<any>>('http://localhost:5000/api/todo');
  }

  createTodo(name: string) {
    const obj: any = {};
    obj.name = name;
    obj.isComplete = true;
    console.log('name', obj);
    this.http.post<any>('http://localhost:5000/api/todo/create', obj).subscribe(res => this.getAllTodo());
  }
}
