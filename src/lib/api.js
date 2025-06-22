//api 관련 코드들을 한 곳에 몰아넣는 lib/api.js 파일
const API_BASE = '/api';

// routes/api/todos로 요청을 보내고 response.json()을 return한다
export async function fetchTodos() {
  const response = await fetch(`${API_BASE}/todos`);
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

// todo를 받아서 POST로 routes/api/todos에 요청을 보내 할 일을 추가하는 함수
export async function createTodo(todo) {
  const response = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
}

// todo와 updates를 받아서 routes/api/todos/id에 요청을 보내 할 일을 수정하는 함수
export async function updateTodo(id, updates) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
}

// id를 받아 할 일을 삭제하는 함수
export async function deleteTodo(id) {
  const response = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete todo');
}