//Response 객체를 생성하는 함수인 json을 import
import { json } from '@sveltejs/kit';

// 메모리에 저장할 할 일 목록 (실제로는 데이터베이스 사용)
//todos를 배열로 선언하고 id, text, 완료 여부, 중요도, 카테고리, 생성 날짜를 포함하는 객체를 원소로 넣음
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

let nextId = 3; //추가될 todo의 id를 저장하는 변수

//JSDoc을 통해 함수의 타입이 GET, POST, PATCH, DELETE 등이라는 것을 알려준다
/** @type {import('./$types').RequestHandler} */
//export 키워드를 통해 SvelteKit에서 GET 함수를 사용할 수 있게 하고 async 키워드를 통해 비동기로 선언함
//api 루트로 GET 요청을 받으면 todos 배열을 Response 객체로 만들어서 return함
export async function GET() {
  // 실제로는 데이터베이스에서 조회
  return json(todos);
}

//JSDoc을 통해 함수의 타입이 GET, POST, PATCH, DELETE 등이라는 것을 알려준다
/** @type {import('./$types').RequestHandler} */
//export 키워드를 통해 SvelteKit에서 GET 함수를 사용할 수 있게 하고 async 키워드를 통해 비동기로 선언함
//객체 구조 분해 할당을 이용해 request 객체만 뽑아냄
export async function POST({ request }) {
  const newTodo = await request.json(); //JSON 문자열을 객체로 변환해 newTodo에 저장
  
  const todo = {
    id: nextId++,
    ...newTodo, //전개 구문을 이용해 todo 객체에 newTodo 객체를 포함시킨다
    createdAt: new Date().toISOString()
  };
  
  todos.push(todo); //todos 배열에 todo 객체를 push 함
  
  return json(todo, { status: 201 }); //todo 객체를 201 상태 코드(요청이 성공되어서 새로운 리소스가 생성됨)와 함께 Response 객체로 반환
}