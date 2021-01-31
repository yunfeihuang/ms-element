<template>
  <div>
    <Layout>
      <div slot="body">
        body内容区
      </div>
      <div>
        其他内容
      </div>
    </Layout>
  </div>
</template>

<script>
import Layout from './Layout'
export default {
  components: {
    Layout
  }
}
</script>
