const API_URL = "http://localhost:5001/api";

export const fetchTasks = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = queryParams ? `${API_URL}/tasks?${queryParams}` : `${API_URL}/tasks`;
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  
  return await response.json();
};

export const getTaskById = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }
  
  return await response.json();
};

export const completeTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}/complete`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to complete task: ${response.statusText}`);
  }
  
  return await response.json();
};

export const updateTaskProgress = async (id, progress) => {
  const response = await fetch(`${API_URL}/tasks/${id}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(progress),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task progress: ${response.statusText}`);
  }
  
  return await response.json();
};

export const addTaskComment = async (id, comment) => {
  const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(comment),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.statusText}`);
  }
  
  return await response.json();
};

// Authentication API functions
export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }
  
  return await response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }
  
  return await response.json();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
};

export const createTask = async (task) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(task),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }
  
  return await response.json();
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, { 
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
  
  return await response.json();
};

export const updateTask = async (id, updates) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }
  
  return await response.json();
};