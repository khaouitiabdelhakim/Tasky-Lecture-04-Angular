import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTaskText: string = '';
  title = 'Tasky';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.http.get<Task[]>('http://localhost:8081/api/tasks/all').subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  addTask() {
    if (this.newTaskText.trim()) {
      const newTask: Task = {
        id: 0,
        text: this.newTaskText,
        completed: false,
      };

      this.http
        .post<Task>('http://localhost:8081/api/tasks/new', newTask)
        .subscribe({
          next: (task) => {
            this.tasks.push(task);
            this.newTaskText = '';
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  updateTask(task: Task) {
    task.completed = !task.completed;
    this.http
      .put<Task>(`http://localhost:8081/api/tasks/update/${task.id}`, task)
      .subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex((t) => t.id === updatedTask.id);
          this.tasks[index] = updatedTask;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.http
        .delete(`http://localhost:8081/api/tasks/delete/${id}`)
        .subscribe({
          next: () => {
            this.tasks = this.tasks.filter((task) => task.id !== id);
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
}
