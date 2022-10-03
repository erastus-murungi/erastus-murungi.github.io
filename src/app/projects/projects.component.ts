import { Component, OnInit, Input } from '@angular/core';
import { ProjectItem, ALL_PROJECTS } from '../project-item/models/ProjectItem'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  @Input() projectItems: ProjectItem[] = ALL_PROJECTS;

  constructor() { }

  ngOnInit(): void {
  }

}
