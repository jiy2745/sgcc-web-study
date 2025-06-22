<script>
  import { onMount } from 'svelte';
  import { todos, filteredTodos, loading, notifications } from '$lib/stores.js';
  import { fetchTodos, createTodo, updateTodo, deleteTodo } from '$lib/api.js';
  import TodoForm from '$lib/components/TodoForm.svelte';
  import TodoItem from '$lib/components/TodoItem.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  
  onMount(async () => {
    await loadTodos();
  });
  
  // 할 일 목록 불러오기 (lib/api.js에 정의된 fetchTodo 함수를 이용해)
  async function loadTodos() {
    loading.set(true);
    try {
      const data = await fetchTodos();
      todos.set(data);
    } catch (error) {
      addNotification('할 일 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      loading.set(false);
    }
  }
  
  // 할 일 추가하기 (lib/api.js에 정의된 createTodo 함수를 이용해)
  async function handleCreateTodo(event) {
    try {
      const newTodo = await createTodo(event.detail);
      todos.update(list => [...list, newTodo]);
      addNotification('할 일이 추가되었습니다.', 'success');
    } catch (error) {
      addNotification('할 일 추가에 실패했습니다.', 'error');
    }
  }
  
  // 할 일 업데이트하기 (lib/api.js에 정의된 updateTodo 함수를 이용해)
  async function handleUpdateTodo(event) {
    const { id, ...updates } = event.detail;
    try {
      const updatedTodo = await updateTodo(id, updates);
      todos.update(list => list.map(todo => todo.id === id ? updatedTodo : todo));
      addNotification('할 일이 수정되었습니다.', 'success');
    } catch (error) {
      addNotification('할 일 수정에 실패했습니다.', 'error');
    }
  }

  // 할 일 지우기 (lib/api.js에 정의된 deleteTodo 함수를 이용해)
  async function handleDeleteTodo(event) {
    const id = event.detail;
    try {
      await deleteTodo(id);
      todos.update(list => list.filter(todo => todo.id !== id));
      addNotification('할 일이 삭제되었습니다.', 'success');
    } catch (error) {
      addNotification('할 일 삭제에 실패했습니다.', 'error');
    }
  }
  
  // notifications 스토어를 이용해 알림을 업데이트하고 3초 후에 제거함
  function addNotification(message, type = 'info') {
    const id = Date.now();
    // 현재 notifications 스토어의 목록을 list로 받아 전개 구문을 이용하여 id, message, type이 포함된 객체를 추가해 업데이트함
    notifications.update(list => [...list, { id, message, type }]);
    // 3초 후에 list 전체의 id와 방금 추가한 알림의 id를 비교해 방금 추가한 알림만 제거하고 업데이트함
    setTimeout(() => {
      notifications.update(list => list.filter(n => n.id !== id));
    }, 3000);
  }
</script>

<svelte:head>
  <title>할 일 관리 - 홈</title>
  <meta name="description" content="SvelteKit으로 만든 할 일 관리 애플리케이션" />
</svelte:head>

<div class="page">
  <h1>할 일 관리</h1>
  <!-- lib/components에서 정의한 TodoForm -->
  <TodoForm on:submit={handleCreateTodo} />
  
  <!-- lib/components에서 정의한 FilterBar -->
  <FilterBar />
  
  {#if $loading}
    <div class="loading" transition:fade>
      <div class="spinner"></div>
      <p>로딩 중...</p>
    </div>
  {:else if $filteredTodos.length === 0}
    <div class="empty-state" transition:fade>
      <p>할 일이 없습니다.</p>
      <p>새로운 할 일을 추가해보세요! 🎯</p>
    </div>
  {:else}
    <div class="todo-list">
      {#each $filteredTodos as todo (todo.id)}
        <div animate:flip="{{ duration: 300 }}">
          <!-- lib/components에서 정의한 TodoItem -->
          <TodoItem 
            {todo}
            on:update={handleUpdateTodo}
            on:delete={handleDeleteTodo}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- 알림 메시지 -->
{#if $notifications.length > 0}
  <div class="notifications">
    {#each $notifications as notification (notification.id)}
      <div 
        class="notification notification-{notification.type}"
        transition:fade="{{ duration: 200 }}"
      >
        {notification.message}
      </div>
    {/each}
  </div>
{/if}

<style>
  .page {
    max-width: 800px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    color: var(--primary);
    margin-bottom: 2rem;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 2rem;
    height: 2rem;
    border: 2px solid var(--border);
    border-top: 2px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-light);
  }
  
  .todo-list {
    margin-top: 1rem;
  }
  
  .notifications {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .notification {
    padding: 1rem;
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .notification-success {
    background: var(--success);
  }
  
  .notification-error {
    background: var(--error);
  }
  
  .notification-info {
    background: var(--primary);
  }
</style>