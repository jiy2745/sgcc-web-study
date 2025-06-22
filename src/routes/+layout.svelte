<!-- 루트의 최상단에 +layout.svelte를 적용했으므로 모든 페이지의 틀로 사용된다-->
<script>
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores.js';
  import Header from '$lib/components/Header.svelte';
  import '../app.css';
  
  onMount(() => {
    // 테마 적용
    // theme 스토어를 구독해 테마가 바뀔 때마다 알 수 있음
    const unsubscribe = theme.subscribe(value => {
      // 브라우저에서 html 태그의 data-theme 속성을 번경
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', value);
      }
    });
    
    return unsubscribe;
  });
</script>

<div class="app">
  <!-- lib/components에서 정의한 Header -->
  <Header />
  <main class="main">
    <!-- 여기에 +page.svelte 내용이 들어감-->
    <slot />
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
  }
</style>
