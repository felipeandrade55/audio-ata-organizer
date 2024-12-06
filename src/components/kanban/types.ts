export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  deadline?: string;
  priority?: string;
}

export interface Column {
  id: string;
  title: string;
}