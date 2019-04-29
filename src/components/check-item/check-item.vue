<template>
  <label class="container">{{ label }}
    <input type="checkbox" v-model="checked">
    <span class="checkmark"></span>
    <span class="delete" @click="removeItem">
     <svg role="img"
          xmlns="http://www.w3.org/2000/svg"
          width="22px"
          height="22px"
          viewBox="0 0 24 24"
          aria-labelledby="binIconTitle binIconDesc"
          stroke="#ff5555"
          stroke-width="1"
          stroke-linecap="square"
          stroke-linejoin="miter"
          fill="none" color="#ff5555"> <title id="binIconTitle">Delete</title> <desc id="binIconDesc">Deletes this item</desc>
       <path d="M19 6L5 6M14 5L10 5M6 10L6 20C6 20.6666667 6.33333333 21 7 21 7.66666667 21 11 21 17 21 17.6666667 21 18 20.6666667 18 20 18 19.3333333 18 16 18 10"/> </svg>

    </span>
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
