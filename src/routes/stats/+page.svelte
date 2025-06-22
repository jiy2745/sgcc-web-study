<script>
  import { stats, todos } from '$lib/stores.js';
  import { derived } from 'svelte/store';
  
  // derived 함수를 통해 writable 스토어 todos가 업데이트되면 자동으로 통계를 업데이트함
  const categoryStats = derived(todos, ($todos) => {
    const categories = {};
    // todos를 forEach 메소드로 돌림
    $todos.forEach(todo => {
      // 카테고리가 없으면 일반으로 설정
      const cat = todo.category || '일반';
      // categories[cat]이 없으면 { total: 0, completed: 0 }으로 설정
      if (!categories[cat]) {
        categories[cat] = { total: 0, completed: 0 };
      }
      // 각 카테고리의 총 할 일 통계에 1을 더한다
      categories[cat].total++;
      // 완료된 작업이면 각 카테고리의 완료한 할 일 통계에 1을 더한다
      if (todo.completed) {
        categories[cat].completed++;
      }
    });

    //Object.entries를 통해 categories 배열을 객체로 바꾸고, map 메소드를 통해 카테고리의 이름과 통계를 뽑는다
    return Object.entries(categories).map(([name, stats]) => ({
      // 카테고리 이름
      name,
      // 통계 (전개 구문)
      ...stats,
      // 삼항 연산자를 이용하여 퍼센트를 저장
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
    }));
  });
  // 마찬가지로 derived 함수를 통해 writable 스토어 todos가 업데이트되면 자동으로 통계를 업데이트함
  const priorityStats = derived(todos, ($todos) => {
    const priorities = { high: 0, medium: 0, low: 0 };
    // forEach 메소드를 통해 high, medium, low 우선순위를 가진 todo마다 priorities 통계에 1씩 더한다
    $todos.forEach(todo => {
      priorities[todo.priority]++;
    });
    return priorities;
  });
</script>

<!-- 타이틀 이름 정하기 -->
<svelte:head>
  <title>할 일 관리 - 통계</title>
</svelte:head>

<div class="stats-page">
  <h1>📊 통계</h1>
  
  <div class="stats-grid">
    <div class="stat-card">
      <h2>전체 현황</h2>
      <div class="stat-number">{$stats.total}</div>
      <div class="stat-label">총 할 일</div>
      
      <div class="progress-bar">
        <!-- $stats.completed / $stats.total를 계산해 width: % 안에 넣어 진행 상태를 표시 -->
        <div 
          class="progress-fill"
          style="width: {$stats.total > 0 ? ($stats.completed / $stats.total) * 100 : 0}%"
        ></div>
      </div>
      
      <div class="stat-details">
        <span class="completed">완료: {$stats.completed}</span>
        <span class="pending">진행중: {$stats.pending}</span>
      </div>
    </div>
    
    <div class="stat-card">
      <h2>우선순위별 분포</h2>
      <div class="priority-chart">
        <div class="priority-item">
          <span class="priority-icon">🔴</span>
          <span class="priority-label">높음</span>
          <span class="priority-count">{$priorityStats.high}</span>
        </div>
        <div class="priority-item">
          <span class="priority-icon">🟡</span>
          <span class="priority-label">보통</span>
          <span class="priority-count">{$priorityStats.medium}</span>
        </div>
        <div class="priority-item">
          <span class="priority-icon">🟢</span>
          <span class="priority-label">낮음</span>
          <span class="priority-count">{$priorityStats.low}</span>
        </div>
      </div>
    </div>
    
    <div class="stat-card category-stats">
      <h2>카테고리별 진행률</h2>
      {#each $categoryStats as category}
        <div class="category-item">
          <div class="category-header">
            <span class="category-name">{category.name}</span>
            <span class="category-percentage">{category.percentage}%</span>
          </div>
          <div class="category-progress">
            <div 
              class="category-progress-fill"
              style="width: {category.percentage}%"
            ></div>
          </div>
          <div class="category-details">
            {category.completed}/{category.total} 완료
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .stats-page {
    max-width: 1000px;
    margin: 0 auto;
  }
  
  h1 {
    text-align: center;
    color: var(--primary);
    margin-bottom: 2rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2rem;
    text-align: center;
  }
  
  .stat-card h2 {
    margin: 0 0 1rem 0;
    color: var(--text);
  }
  
  .stat-number {
    font-size: 3rem;
    font-weight: bold;
    color: var(--primary);
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    color: var(--text-light);
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 1rem;
    background: var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    margin-bottom: 1rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--success));
    transition: width 0.3s ease;
  }
  
  .stat-details {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }
  
  .completed {
    color: var(--success);
  }
  
  .pending {
    color: var(--warning);
  }
  
  .priority-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .priority-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: var(--bg);
    border-radius: 0.5rem;
  }
  
  .priority-icon {
    font-size: 1.2rem;
  }
  
  .priority-label {
    flex: 1;
    text-align: left;
    margin-left: 0.75rem;
  }
  
  .priority-count {
    font-weight: bold;
    color: var(--primary);
  }
  
  .category-stats {
    text-align: left;
  }
  
  .category-item {
    margin-bottom: 1.5rem;
  }
  
  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .category-name {
    font-weight: 500;
  }
  
  .category-percentage {
    font-weight: bold;
    color: var(--primary);
  }
  
  .category-progress {
    width: 100%;
    height: 0.5rem;
    background: var(--border);
    border-radius: 0.25rem;
    overflow: hidden;
    margin-bottom: 0.25rem;
  }
  
  .category-progress-fill {
    height: 100%;
    background: var(--primary);
    transition: width 0.3s ease;
  }
  
  .category-details {
    font-size: 0.875rem;
    color: var(--text-light);
  }
</style>