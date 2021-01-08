import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Vue from 'vue'
import { quillEditor, Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'

Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/ImageDrop', ImageDrop)

var BaseImageFormat = Quill.import('formats/image')
const ImageFormatAttributesList = [
  'alt',
  'height',
  'width',
  'style'
]
class ImageFormat extends BaseImageFormat {
  static formats (domNode) {
    return ImageFormatAttributesList.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }
      return formats
    }, {})
  }
  format (name, value) {
    if (ImageFormatAttributesList.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value)
      } else {
        this.domNode.removeAttribute(name)
      }
    } else {
      super.format(name, value)
    }
  }
}

Quill.register(ImageFormat, true)
const SizeStyle = Quill.import('attributors/style/size')
SizeStyle.whitelist = ['small', false, 'large', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px']
Quill.register(SizeStyle, true)
const FontStyle = Quill.import('attributors/style/font')
FontStyle.whitelist = ['微软雅黑', '宋体', '黑体', '楷体', '隶书', 'arial', 'impact']
Quill.register(FontStyle, true)
let AlignStyle = Quill.import('attributors/style/align')
Quill.register(AlignStyle, true)
let DirectionStyle = Quill.import('attributors/style/direction')
Quill.register(DirectionStyle, true)
quillEditor.props.options = {
  type: Object,
  default () {
    return {
      placeholder: '请输入内容',
      modules: {
        imageResize: {
          // modules: ['Resize', 'DisplaySize']
        },
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}],
          [{'indent': '-1'}, {'indent': '+1'}],
          [{'direction': 'rtl'}],
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'size': SizeStyle.whitelist}],
          [{'font': FontStyle.whitelist}],
          [{'color': []}, {'background': []}],
          [{'align': []}],
          ['link', 'image', 'video']
        ]
      }
    }
  }
}
if (!quillEditor.mixins) {
  quillEditor.mixins = []
}
quillEditor.mixins.push({
  mounted () {
    setTimeout(() => {
      let quill = this.quill
      let el = this.$el.querySelector('.ql-image')
      new Vue({ // eslint-disable-line
        el,
        template: `
          <el-upload
            list-type="picture"
            multiple
            style="float:left;width:auto;height:auto;margin-right: 0;"
            @change="handleChange($event)">
            <button style="float:none" type="button" class="ql-image">
              <svg viewBox="0 0 18 18">
                <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect>
                <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
                <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
              </svg>
            </button>
          </el-upload>
        `,
        methods: {
          handleChange (event) {
            quill.insertEmbed(quill.getSelection().index, 'image', event)
          }
        }
      })
    }, 1000)
  }
})
export {
  quillEditor,
  Quill
}
