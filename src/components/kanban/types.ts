export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  priority?: string;
  user_id?: string;
}

export interface Column {
  id: string;
  title: string;
  column_type?: string;
  order_index?: number;
  user_id?: string;
}