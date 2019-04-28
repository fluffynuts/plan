<template>
  <label class="container">{{ label }}
    <input type="checkbox" v-model="checked">
    <span class="checkmark"></span>
    <span class="delete" @click="removeItem">[X]</span>
  </label>

</template>

<script lang="ts" src="./check-item.ts"></script>

<style lang="scss" scoped>
  /* The container */
  label {
    display: block;
    position: relative;
    padding-left: 40px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: left;

    /* Hide the browser's default checkbox */
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;

      /* When the checkbox is checked, add accented background */
      &:checked ~ .checkmark {
        background-color: var(--accent);
      }

      /* Create the checkmark/indicator (hidden when not checked) */
      /* Show the checkmark when checked */
      &:checked ~ .checkmark:after {
        display: block;
      }

    }

    /* Create a custom checkbox */
    span.checkmark {
      position: absolute;
      top: 0;
      left: 0;
      height: 25px;
      width: 25px;
      background-color: transparent;
      border-color: var(--secondary-background);
      border-width: 2px;
      border-style: solid;
      border-radius: 100%;

      /* Style the checkmark/indicator */
      &:after {
        content: "";
        position: absolute;
        display: none;
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }


    }

    /* On mouse-over, add a grey background color */
    &:hover input ~ .checkmark {
      background-color: var(--secondary-background);
    }

    span.delete {
      display: none;
    }

    &:hover span.delete {
      display: inline;
      position: absolute;
      right: 10px;
    }

  }


</style>
