import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ProjectList, Project } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    
    ) { }

  getProjects(page): Promise<ProjectList> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/projects?page=${page}`)
      .subscribe((res: ProjectList) => {
        resolve(
          res
        );
      }, (err) => {
        reject();
      });
    });
  }

  getProjectInfo(projectId): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/projects/${projectId}?edit=true`)
      .subscribe((res: Project) => {
        resolve(res);
      }, (err) => {
        reject();
      });
    });
  }

  deleteProject(projectId) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}/projects/${projectId}`)
      .subscribe((res: Project) => {
        resolve();
      }, (err) => {
        reject();
      });
    });
  }

  createProject(name, description, content) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('projectName', name);
      formData.append('projectDescription', description);
      this.http.post(`${environment.apiUrl}/projects`, formData)
      .subscribe((res: any) => {
        console.log(res);
        resolve(res.identifier);
      }, (err) => {
        reject();
      });
    });
  }

  updateProject(name, description, content, projectId) {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/projects/${projectId}`, {projectName: name, content, projectDescription: description})
      .subscribe((res: any) => {
        if (res.success) {
          resolve();
        } else {
          reject();
        }
      }, (err) => {
        reject();
      });

    });
  }

  copyProjectUrl(projecId) {
    return new Promise((resolve, reject) => {

    });
  }
}
