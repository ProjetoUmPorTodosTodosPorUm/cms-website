<script lang="ts">
  import Icon from "svelte-icons-pack";
  import FiChevronLeft from "svelte-icons-pack/fi/FiChevronLeft";
  import FiChevronRight from "svelte-icons-pack/fi/FiChevronRight";
  import "$lib/scss/components/pagination.scss";

  export let page = 1;
  export let maxPage = 1;
  
  $: maxPage, updatePages();
  let pages = Array(maxPage);

  // svelte cant handle just using Array(maxPage)
  function updatePages() {
    if (maxPage < 1) return;

    pages = [];
    for(let i = 0; i < maxPage; i++) {
      pages = [...pages, 0]
    }
  }
  
  function onPreviousPage() {
    page = page > 1 ? page - 1 : page;
  }

  function onNextPage() {
    page = page < maxPage ? page + 1 : page;
  }

  function onPageSelect(selectedPage: number) {
    page = selectedPage
  }
</script>

<div class="pagination">
  <button class="item previous" on:click={onPreviousPage}>
    <Icon src={FiChevronLeft} />
  </button>
  {#each pages as _, index (index)}
    <button 
      class={`item pages ${index+1 == page ? 'active': ''}`}
      on:click={() => onPageSelect(index+1)}
    >
    {index + 1}
    </button>
  {/each}
  <button class="item next" on:click={onNextPage}>
    <Icon src={FiChevronRight} />
  </button>
</div>