<script>
  import { createEventDispatcher } from 'svelte';
  import { scale, fly } from 'svelte/transition';
  
  export let todo;

  // 부모 컴포넌트에 데이터를 보내는 dispatch를 정의
  const dispatch = createEventDispatcher();
  
  // 현재 할 일의 텍스트를 수정하고 있는지 여부를 저장하는 변수
  let editing = false;
  // 수정한 할 일의 텍스트를 저장하는 변수
  let editText = todo.text;
  
  //수정 버튼을 눌렀을 때 호출되는 함수
  function startEdit() {
    editing = true;
    editText = todo.text;
  }
  
  // 할 일의 텍스트를 수정했을 때 호출되는 함수
  function saveEdit() {
    if (editText.trim()) {
      // update라는 이름으로 부모 컴포넌트에 업데이트된 할 일을 보냄
      dispatch('update', { ...todo, text: editText.trim() });
    }
    editing = false;
  }
  
  // 수정을 취소했을 때 호출되는 함수
  function cancelEdit() {
    editing = false;
    editText = todo.text;
  }
  
  // 엔터를 누르면 saveEdit 함수를 불러오고, esc를 누르면 cancelEdit 함수를 불러온다
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }
  
  // 할 일의 완료 여부를 나타내는 체크박스를 눌렀을 때 불러오는 함수
  // 완료 여부를 수정한다 (todo.completed가 참이면 거짓으로, todo.completed가 거짓이면 참으로)
  function toggleComplete() {
    dispatch('update', { ...todo, completed: !todo.completed });
  }
  
  // 부모 컴포넌트에게 delete란 이름으로 할 일의 id를 보낸다 
  function deleteTodo() {
    dispatch('delete', todo.id);
  }

  // 할 일 텍스트를 수정하는 input이 나타나면 포커스를 맞추도록 함
  function focusOnMount(node) {
    node.focus();
    return {};
  }
</script>

<!-- fly와 scale을 통해 나타날 때와 사라질 때 애니메이션 효과를 줌-->
<div class="todo-item" class:completed={todo.completed} in:fly="{{ y: -20, duration: 300 }}" out:scale="{{ duration: 200 }}">
  <!-- 체크박스를 클릭하면 toggleComplete 함수를 실행함 -->
  <input 
    type="checkbox" 
    checked={todo.completed} 
    on:change={toggleComplete}
    class="checkbox"
  />
  
  <!-- 수정하고 있으면 input을, 아니면 할 일의 텍스트를 보여줌 -->
  {#if editing}
    <!-- use:focusOnMount로 요소가 나타나면 포커싱함 -->
    <!-- on:blur로 포커스를 잃었을 때 saveEdit 함수를 실행함 -->
    <input 
      bind:value={editText}
      on:keydown={handleKeydown}
      on:blur={saveEdit}
      class="edit-input"
      use:focusOnMount
    />
  {:else}
    <span class="todo-text" on:dblclick={startEdit} role="button" tabindex="0">
      {todo.text}
    </span>
  {/if}
  
  <!-- 할 일의 중요도, 카테고리, 만든 시간을 보여줌 -->
  <div class="todo-meta">
    <span class="priority priority-{todo.priority}">
      {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
    </span>
    <span class="category">{todo.category || '일반'}</span>
    <time class="created-at">
      {new Date(todo.createdAt).toLocaleDateString('ko-KR')}
    </time>
  </div>
  
  <div class="todo-actions">
    <!-- 수정 중이지 않으면 수정 버튼을 보여줌 -->
    {#if !editing}
      <button class="action-btn edit-btn" on:click={startEdit}>✏️</button>
    {/if}
    <button class="action-btn delete-btn" on:click={deleteTodo}>🗑️</button>
  </div>
</div>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    margin-bottom: 0.5rem;
    transition: all 0.2s;
  }
  
  .todo-item:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  }
  
  .todo-item.completed {
    opacity: 0.7;
  }
  
  .checkbox {
    width: 1.2rem;
    height: 1.2rem;
    accent-color: var(--primary);
  }
  
  .todo-text {
    flex: 1;
    cursor: pointer;
  }
  
  .completed .todo-text {
    text-decoration: line-through;
    color: var(--text-light);
  }
  
  .edit-input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid var(--primary);
    border-radius: 0.25rem;
    background: var(--bg);
    color: var(--text);
  }
  
  .todo-meta {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.875rem;
    color: var(--text-light);
  }
  
  .category {
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
  
  .created-at {
    font-size: 0.75rem;
  }
  
  .todo-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: background-color 0.2s;
  }
  
  .action-btn:hover {
    background: var(--border);
  }
</style>