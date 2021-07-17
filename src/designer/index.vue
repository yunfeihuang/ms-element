<template>
  <div class="ms-designer">
    <div class="ms-designer--pagelist">
        <div class="ms-designer--pagelist-tabs">
          <el-tabs type="card">
            <el-tab-pane v-for="(item,index) in config.tabs.option" :key="index" v-bind="item"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="ms-designer--pagelist-search">
          <el-form>
              <el-form-item v-for="(item,index) in config.search.option" :key="index" :label="item.label">
                <component :is="item.type || 'el-input'" v-bind="props"/>
              </el-form-item>
          </el-form>
        </div>
        <div class="ms-designer--pagelist-table">
          <el-table :data="[{}]">
            <el-table-column v-for="(item,index) in config.search.option" :key="index" v-bind="item">
              <template v-if="item.actions">
                <el-button v-for="(item, index) in item.action" :key="index" type="text">
                  {{item.label}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      config: {
        tabs: {
          option: [
            {
              label: '用户管理',
              name: 'first'
            }
          ]
        },
        search: {
          option: [
            {
              type: 'el-input',
              label: '关键字',
              name: 'aa',
              props: {}
            }
          ]
        },
        table: {
          column: [
            {
              label: '列一',
              prop: 'aa'
            },
            {
              label: '操作',
              actions: [
                {
                  name: 'update',
                  label: '编辑'
                },
                {
                  name: 'delete',
                  label: '删除'
                }
              ]
            }
          ]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
