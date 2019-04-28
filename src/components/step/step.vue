<template>
  <div class="step">
    <div class="content">
      <slot name="content"></slot>
    </div>
    <div class="buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script lang="ts" src="./step.ts">
</script>

<style lang="scss">

  .step {
    display: grid;
    min-height: 100%;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;

    .content {
      height: 100%;
    }
    .buttons {
      display: flex;
      height: 48px;
      width: 100%;
      button {
        cursor: pointer;
        outline: none;
      }
      button:focus, button:active {
        color: var(--accent);
        outline: none;
      }
      /*position: absolute;*/
      /*bottom: 0;*/
    }
  }

</style>
