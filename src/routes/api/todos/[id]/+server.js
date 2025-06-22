import { json, error } from '@sveltejs/kit';

// 실제로는 데이터베이스에서 관리
let todos = [
  {
    id: 1,
    text: 'SvelteKit 학습하기',
    completed: false,
    priority: 'high',
    category: '학습',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    text: '프로젝트 계획 세우기',
    completed: true,
    priority: 'medium',
    category: '업무',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// 리소스를 번경하는 PATCH 매소드
// params에서 id를 받는다 (파일 경로가 [id]를 포함함)
// request에서 request 객체를 받는다
/** @type {import('./$types').RequestHandler} */
export async function PATCH({ params, request }) {
  // 문자열을 parseInt 함수로 정수로 바꾼다
  const id = parseInt(params.id);
  const updates = await request.json();
  
  // todo를 매개변수로 하고 todo의 id와 요청으로 받은 id가 같은지 확인하는 콜백 함수를 인자로 받아 findIndex 메소드로 todos 배열에서 요청받은 id의 인덱스를 찾는다
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  // 요청으로 받은 id가 todos 배열에 없으면 에러를 뱉는다 (findIndex 메소드는 인덱스를 찾지 못하면 -1을 반환함)
  if (todoIndex === -1) {
    throw error(404, 'Todo not found');
  }
  
  // 찾은 인덱스를 이용해 todos 배열을 업데이트함
  todos[todoIndex] = { ...todos[todoIndex], ...updates };

  //번경된 todo를 return함
  return json(todos[todoIndex]);
}

// 리소스를 지우는 DELETE 메소드
// 마찬가지의 방식으로 id를 받아 findIndex 메소드로 인덱스를 찾고, todos에서 요청받은 id의 todo를 지운다
/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
  const id = parseInt(params.id);
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    throw error(404, 'Todo not found');
  }
  
  // splice 메소드로 찾은 인덱스에서부터 하나의 원소를 제거한다
  todos.splice(todoIndex, 1);
  
  // 제거에 성공했다고 반환
  return json({ success: true });
}