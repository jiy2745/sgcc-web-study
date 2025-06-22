<!-- FilterBar라는 컴포넌트를 정의하는 파일 -->
<!-- 관례적으로 src/lib/components 폴더에 컴포넌트들을 정리함 -->

<script>
  // src/lib/stores.js에서 정의된 filter와 stats를 가져옴
  import { filter, stats } from '$lib/stores.js';
  
  const filters = [
    { value: 'all', label: '전체', icon: '📋' },
    { value: 'pending', label: '진행중', icon: '⏳' },
    { value: 'completed', label: '완료', icon: '✅' }
  ];
</script>

<div class="filter-bar">
  <div class="filter-buttons">
    <!-- Svelte의 반복문 블록 -->
    <!-- script 태그에서 정의한 filters 배열을 반복함 -->
    {#each filters as filterOption}
      <!-- class:active에서 현재 필터가 filterOption.value(all, pending, completed 등의 문자열)과 같다면 버튼의 색깔을 파란색(--primary)로 바꾸고 폰트 색깔을 하얀색으로 바꿈 -->
      <!-- on:click으로 버튼을 클릭하면 필터를 filterOption.value로 번경함함-->
      <button
        class="filter-btn"
        class:active={$filter === filterOption.value}
        on:click={() => filter.set(filterOption.value)}
      >
        <span class="filter-icon">{filterOption.icon}</span>
        <span class="filter-label">{filterOption.label}</span>
        <!-- 삼항 연산자를 이용해서 filterOption.value에 따라 할 일의 개수를 유저에게 보여줌 -->
        <!-- stats 스토어에서 통계를 가져온다 -->
        <span class="filter-count">
          {filterOption.value === 'all' ? $stats.total : 
           filterOption.value === 'pending' ? $stats.pending : $stats.completed}
        </span>
      </button>
    {/each}
  </div>
  
  <div class="stats-summary">
    <!-- stats 스토어에서 통계를 가져와서 완료한 할 일 개수를 보여줌 -->
    <span class="stat-item">
      총 {$stats.total}개 중 {$stats.completed}개 완료
    </span>
  </div>
</div>


<style>
  .filter-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    background: var(--surface);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
  }
  
  .filter-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: none;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    color: var(--text);
    transition: all 0.2s;
  }
  
  .filter-btn:hover {
    background: var(--border);
  }
  
  .filter-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
  
  .filter-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .filter-btn.active .filter-count {
    background: rgba(255, 255, 255, 0.3);
  }
  
  .filter-btn:not(.active) .filter-count {
    background: var(--border);
    color: var(--text-light);
  }
  
  .stats-summary {
    color: var(--text-light);
    font-size: 0.875rem;
  }
</style>