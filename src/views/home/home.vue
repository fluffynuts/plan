<template>
  <step>
    <div slot="content" @click="focusInput" style="height: 100%">
      <ul>
        <li v-for="item in items" :key="item.id">
          <check-item :item="item"
                      @item-toggled="itemToggled"
                      @delete-item="deleteItem"></check-item>
        </li>
      </ul>
      <textarea
        ref="userInput"
        autofocus
        tabindex="0"
        aria-label="Add items"
        :rows="userInputRows"
        @keypress="keyPressed"
        v-model="userInput">
      </textarea>

    </div>
  </step>
</template>

<script lang="ts" src="./home.ts"></script>

<style lang="scss" scoped>
  textarea {
    margin: auto;
    width: 90%;
    font-size: 22px;
  }

  ul {
    li {
      list-style: none;
    }
  }

</style>
