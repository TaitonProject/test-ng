import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { INode } from './node.model';

export interface ITreeNode {
  id: number;
  name: string;
  children: Array<ITreeNode>;
  isExpanded: boolean;
  selected: boolean;
}

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {

  @Input() tree: Array<ITreeNode>;
  @Input() SelectedNode: ITreeNode;

  @Output() selectedChanged: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() requestNodes: EventEmitter<ITreeNode> = new EventEmitter();
  @Output() setChildEvent: EventEmitter<ITreeNode> = new EventEmitter();

  constructor() { }

  selectNode(node: ITreeNode) {
    node.selected = !node.selected;
  }

  setChild(node: ITreeNode) {
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => child.selected = node.selected);
    }
    this.setChildEvent.emit(node);
    console.log('node', node);
  }

  onExpand(node: ITreeNode) {

    node.isExpanded = !node.isExpanded;

    if (node.isExpanded && node.children.length === 0) {
      this.requestNodes.emit(node);
    }
  }

}
