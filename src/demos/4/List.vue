<template>
  <ul>
    <li v-for="(item, index) in data" :key="item">
      序号：{{index}}，循环项内容：<slot v-bind="item"></slot>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Array
    }
  }
}
</script>
