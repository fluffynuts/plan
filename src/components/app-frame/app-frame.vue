<template>
  <div class="app-frame">
    <div class="title-bar" ref="titleBar">
      <div class="title">{{ title }}</div>
      <div class="control" @click="close">X</div>
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
    }
  }
  .main-content {
    height: calc(100% - #{$title_scale});
    width: 100%;
  }
</style>
