import { Component, Input } from '@angular/core';
import { ProjectItem, DEFAULT_PROJECT_ITEM, ALL_PROJECTS } from './models/ProjectItem';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent {
  @Input() projectItem: ProjectItem = DEFAULT_PROJECT_ITEM;
  projectGithubUrl: string = this.projectItem.url.href;
}
