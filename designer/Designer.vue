<template>
  <div id="app">
    <ms-frame-layout
      title="designer">
      <template v-slot:logo="scope">
        <i :style="`font-size:${scope.isCollapse?14:26}px;font-style:normal;`">designer</i>
      </template>
      <div
        class="designer-dir"
        slot="menu">
        <div class="designer-dir-toolbar">
          <div>目录</div>
          <i class="el-icon-plus" @click="handleDirForm()"></i>
        </div>
        <el-tree
          :data="dir"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false">
          <span class="designer-dir-tree-node" slot-scope="{ node, data }">
            <span @click="data.type==1 && $router.push({path: `/${data.id}`})">{{ node.label }}</span>
            <span>
              <i class="el-icon-plus" v-if="data.type==0" @click="handleDirForm(data)"></i>
              <i class="el-icon-close" @click="handleDelete(node, data)"></i>
            </span>
          </span>
        </el-tree>
      </div>
      <div slot="nav"></div>
      <div v-if="$route.path=='/'" slot="sub" class="sub">
        <div class="sub-item" @click="$root.$emit('setting')">
          <i class="el-icon-setting"></i>
          <small>设置</small>
        </div>
        <div class="sub-item" @click="$root.$emit('create-column')">
          <i class="el-icon-plus"></i>
          <small>创建列</small>
        </div>
        <div class="sub-item" @click="$root.$emit('preview')">
          <i class="el-icon-view"></i>
          <small>预览</small>
        </div>
        <div class="sub-item" @click="$root.$emit('import')">
          <i class="el-icon-download"></i>
          <small>导入</small>
        </div>
        <div class="sub-item" @click="$root.$emit('export')">
          <i class="el-icon-upload2"></i>
          <small>导出</small>
        </div>
      </div>
    </ms-frame-layout>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      dir: [
        {
          label: '设计首页',
        },
        {
          label: '用户管理'
        }
      ]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.loading = true
      this.$axios({
        url: '/designer/dir/index'
      }).then(res => {
        this.dir = res.data.data
      }).finally(() => {
        this.loading = false
      })
    },
    update () {
      return this.$axios({
        url: '/designer/dir/index',
        method: 'PUT',
        data: {
          dir: this.dir
        }
      })
    },
    handleDirForm (data, params) {
      let self = this
      ms.navigator.push(this, () => import('./components/DirForm'), {
        title: !params ? '创建' : '编辑',
        params,
        promiseSubmit (form) {
          if (!form.id) {
            form.id = Math.random().toString(36).substr(2)
          }
          if (data) {
            if (!data.children) {
              self.$set(data, 'children', [])
            }
            data.children.push(form)
          } else {
            self.dir.push(form)
          }
          return self.update()
        }
      })
    },
    handleDelete (node, data) {
      this.$confirm('确定删除此数据?', '提示', {
        type: 'warning'
      }).then(() => {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
        this.update()
      })
    }
  }
}
</script>
<style lang="scss">
  .ms-loading-element{
    position: relative;
  }
  .sub{
    background:#fff;
    width:56px;
    margin: 10px;
    margin-right:0;
    text-align: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    padding:1px 0;
    &-item{
      margin:15px 0;
      cursor: pointer;
      i{
        display: block;
        font-size: 24px;
      }
      small{
        font-size:12px;
      }
    }
  }
  .designer-dir{
    &-toolbar{
      padding:0 10px;
      border-top: 1px solid #f5f5f5;
      position: sticky;
      top:0;
      display: flex;
      line-height: 32px;
      align-items: center;
      >div{
        flex: 1;
      }
      i{
        padding:0 5px;
      }
    }
    &-tree-node{
      flex:1;
      display: flex;
      padding-right:10px;
      >span:first-child{
        flex:1;
      }
      i{
        margin-left:10px;
        display:none;
      }
      &:hover i{
        display:inline;
      }
    }
  }
</style>
