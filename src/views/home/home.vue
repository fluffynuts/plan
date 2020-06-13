<template>
  <step>
    <div slot="content" @click="focusInput" style="height: 100%">
      <textarea
        ref="userInput"
        autofocus
        tabindex="0"
        aria-label="Add items"
        :rows="userInputRows"
        @keypress="keyPressed"
        v-model="userInput">
      </textarea>
      <vddl-list
        :horizontal="false"
        :list="items">
        <vddl-draggable
          v-for="(item, index) in items"
          :key="item.id"
          :draggable="item"
          :index="index"
          :wrapper="items"
          :drop="handleDrop"
          effect-allowed="move">
          <vddl-handle></vddl-handle>
          <check-item
            :item="item"
            :moved="handleMoved"
            @item-toggled="itemToggled"
            @delete-item="deleteItem"></check-item>
        </vddl-draggable>
      </vddl-list>
<!--      <ul>-->
<!--        <li v-for="item in items" :key="item.id">-->
<!--          <check-item :item="item"-->
<!--                      @item-toggled="itemToggled"-->
<!--                      @delete-item="deleteItem"></check-item>-->
<!--        </li>-->
<!--      </ul>-->
    </div>
  </step>
</template>

<script lang="ts" src="./home.ts">
</script>

<style lang="scss" scoped>
  .vdd-list, .vddl-draggable {
    position: relative;
  }
  .vddl-dragging {
    opacity: 0.7;
  }
  .vddl-dragging-source {
    display: none;
  }
  textarea {
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    width: 90%;
    font-size: 22px;
    border-radius: 4px;
  }

  ul {
    li {
      list-style: none;
    }
  }

</style>
