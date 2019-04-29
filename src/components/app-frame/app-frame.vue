<template>
  <div class="app-frame">
    <div class="title-bar" ref="titleBar">
      <div class="title">{{ title }}</div>
      <div class="control" @click="close">
        <svg role="img"
             xmlns="http://www.w3.org/2000/svg"
             width="24px"
             height="24px"
             viewBox="0 0 24 24"
             aria-labelledby="cancelIconTitle cancelIconDesc"
             stroke="#ffffff"
             stroke-width="1"
             stroke-linecap="square"
             stroke-linejoin="miter"
             fill="none" color="#ffffff"> <title id="cancelIconTitle">Close</title> <desc id="cancelIconDesc">Closes the window</desc> <path d="M15.5355339 15.5355339L8.46446609 8.46446609M15.5355339 8.46446609L8.46446609 15.5355339"/> <path d="M4.92893219,19.0710678 C1.02368927,15.1658249 1.02368927,8.83417511 4.92893219,4.92893219 C8.83417511,1.02368927 15.1658249,1.02368927 19.0710678,4.92893219 C22.9763107,8.83417511 22.9763107,15.1658249 19.0710678,19.0710678 C15.1658249,22.9763107 8.83417511,22.9763107 4.92893219,19.0710678 Z"/> </svg>

      </div>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" src="./app-frame.ts">
</script>
<style lang="scss" scoped>
  $title_scale: 32px;
  .app-frame {
    height: 100%;
    width: 100%;
  }
  .title-bar {
    width: 100%;
    background: var(--secondary-background);
    color: var(--primary-foreground);
    line-height: $title_scale;
    display: flex;
    flex-direction: row;
    height: $title_scale;
    .title {
      flex: 1;
      -webkit-app-region: drag;
    }
    .control {
      width: $title_scale;
      cursor: pointer;
      margin-top: 3px;
    }
  }
  .main-content {
    height: calc(100% - #{$title_scale});
    width: 100%;
  }
</style>
