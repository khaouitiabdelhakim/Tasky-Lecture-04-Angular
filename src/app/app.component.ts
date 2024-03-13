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
  styleUrls: ['./app.component.css']
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
    this.http.get<Task[]>('http://localhost:8081/api/tasks').subscribe(
      (response: Task[]) => {
        this.tasks = response;
        console.log('Tasks:', this.tasks);
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  addTask() {
    if (this.newTaskText.trim()) {
      const newTask: Task = {
        id: 0,
        text: this.newTaskText,
        completed: false
      };

      this.http.post<Task>('http://localhost:8081/api/tasks', newTask).subscribe(task => {
        this.tasks.push(task);
        this.newTaskText = '';
      });
    }
  }

  updateTask(task: Task) {
    task.completed = !task.completed;
    this.http.put<Task>(`http://localhost:8081/api/tasks/${task.id}`, task).subscribe();
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.http.delete(`http://localhost:8081/api/tasks/${id}`).subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      });
    }
  }
}
