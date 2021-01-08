class Navigator {
  constructor (context, importFunction) {
    this.context = context
    this.AsyncComponent = () => ({
      component: new Promise((resolve, reject) => {
        importFunction().then(res => {
          const ImportComponent = res.default
          resolve({
            functional: true,
            render (createElement, context) {
              let {parent, props, listeners} = context
              const handleSubmit = (e) => {
                let $form = parent.$refs['import-component-' + name]
                $form && $form.handleSubmit && $form.handleSubmit()
              }
              const handleReset = (e) => {
                let $form = parent.$refs['import-component-' + name]
                $form && $form.handleSubmit && $form.handleReset()
              }
              const handleCancel = () => {
                let $drawer = parent.$refs['drawer-' + name]
                $drawer && $drawer.closeDrawer && $drawer.closeDrawer()
              }
              const handleSuccess = () => {
                if (!listeners.success) {
                  if (parent.popupOpen instanceof Array) {
                    if (parent.popupOpen && parent.popupOpen.length < 2) {
                      parent.fetch && parent.fetch(parent.query)
                    }
                  } else {
                    parent.fetch && parent.fetch(parent.query)
                  }
                }
              }
              const handleMounted = (el) => {
                let modelNode = el.closest('.el-drawer__container')
                if (modelNode) {
                  modelNode.title = '双击可以快速关闭弹框'
                  modelNode.querySelector('.e-drawer').title = ''
                  modelNode.ondblclick = event => {
                    if (modelNode === event.target) {
                      handleCancel()
                    }
                  }
                }
              }
              return (
                <div class="e-drawer--layout">
                  <div class="e-drawer--body scroller">
                    <ImportComponent
                      ref={'import-component-' + name}
                      popupManager={parent}
                      popupName={name}
                      {...{ attrs: props }}
                      defaultQuery={props.query}
                      onSuccess={handleSuccess}
                      onClose={handleCancel}
                      onMounted={handleMounted}
                    />
                  </div>
                  {render && render.footer && render.footer ? <div class="e-drawer--footer">{render.footer(createElement, context)}</div> : isForm && <div class="e-drawer--footer">
                    <el-button
                      type="primary"
                      size="small"
                      nativeType="button"
                      onClick={handleSubmit}>
                      {props.confirmText || '确定'}
                    </el-button>
                    <el-button
                      size="small"
                      nativeType="button"
                      onClick={handleReset}>
                      {props.resetText || '重置'}
                    </el-button>
                    <el-button
                      size="small"
                      nativeType="button"
                      onClick={handleCancel}>
                      {props.cancelText || '取消'}
                    </el-button>
                  </div>
                  }
                </div>
              )
            }
          })
        }).catch(() => {
          resolve({
            functional: true,
            template: `
              <div class="e-drawer--error">
                <i class="el-icon-circle-close"></i>
                <br />
                加载失败
              </div>
            `
          })
        })
      })
    })
  }
  push () {

  }
  close () {

  }
  replace () {

  }
  render () {
    return {
      functional: true,
      render (createElement, context) {
        return (
          <el-drawer
            vLoading={true}
            visible={true}
            onClose={parent.popClose}
            {...{ attrs: _drawer }}
            customClass={classnames.join(' ')}>
            {render && render.title && <template slot="title">{render.title(createElement, context)}</template>}
            <AsyncComponent
              query={parent.popupsQuery[name]}
              promiseSubmit={props.promiseSubmit}
            />
            <div class="el-loading-mask e-drawer--mask">
              <div class="el-loading-spinner">
                <svg viewBox="25 25 50 50" class="circular">
                  <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                </svg>
              </div>
            </div>
            {_resize && <div class="e-drawer--resize" onMousedown={handleMouseDown}/>}
          </el-drawer>
        )
      }
    }
  }
}
Navigator.create = (context, component) => {
  return new Navigator(context, component)
}