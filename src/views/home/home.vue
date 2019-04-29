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
      <ul>
        <li v-for="item in items" :key="item.id">
          <check-item :item="item"
                      @item-toggled="itemToggled"
                      @delete-item="deleteItem"></check-item>
        </li>
      </ul>
    </div>
  </step>
</template>

<script lang="ts" src="./home.ts"></script>

<style lang="scss" scoped>
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
