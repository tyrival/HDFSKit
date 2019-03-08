<template>
    <div v-if="config.storage.value !== undefined && config.storage.value !== null"
         class="value-panel">
        <div class="toolbar">
            <Input suffix="ios-search"
                   v-model="config.finder.word"
                   placeholder="请输入查找关键字"
                   @on-change="changeWord"
                   @on-enter="findWord"/>
            <ButtonGroup>
                <Button type="default"
                        custom-icon="icon iconfont icon-prev"
                        :disabled="!config.finder.positions || !config.finder.positions.length || config.finder.index === 0"
                        @click="prevPosition"></Button>
                <Button type="default"
                        custom-icon="icon iconfont icon-next"
                        :disabled="!config.finder.positions || !config.finder.positions.length || config.finder.index === config.finder.positions.length - 1"
                        @click="nextPosition"></Button>
            </ButtonGroup>
            <span v-if="config.finder.positions && config.finder.positions.length"
                  class="finder-result">{{config.finder.index + 1}} / {{config.finder.positions.length}}</span>
        </div>
        <Input id="value-area" class="text-area" v-model="config.storage.value" type="textarea"/>
        <div class="menu">
            <ButtonGroup size="small" shape="circle">
                <Button type="primary"
                        custom-icon="icon iconfont icon-download"
                        @click="download"></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-append"
                        @click="appendFile"></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-concat"
                        @click="concatFile"></Button>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>
  import '../../assets/styles/viewport/value-panel.less'
  import Hdfs from '../client/hdfs'

  export default {
    name: 'ValuePanel',
    props: ['config'],
    data () {
      return {
        valueDom: null
      }
    },
    methods: {
      /**
       * 下载
       */
      download () {
        let path = this.config.client.config.path + this.config.storage.data[this.config.storage.index].pathSuffix
        this.config.client.download(path)
      },
      /**
       * 修改查询条件
       */
      changeWord () {
        this.config.finder.index = 0
        this.config.finder.positions = null
      },
      /**
       * 查找文本
       */
      findWord (event) {
        if (event.key !== 'Enter' || !this.config.finder.word) {
          return
        }
        this.config.finder.index = 0
        this.config.finder.positions = []
        let str = this.config.storage.value
        let pos = str.indexOf(this.config.finder.word)
        while (pos > -1) {
          this.config.finder.positions.push(pos)
          pos = str.indexOf(this.config.finder.word, pos + 1)
        }
        this.setPosition()
      },
      /**
       * 查找上一个
       */
      prevPosition () {
        this.config.finder.index--
        this.setPosition()
      },
      /**
       * 查找下一个
       */
      nextPosition () {
        this.config.finder.index++
        this.setPosition()
      },
      /**
       * 获取文本框
       */
      getDom () {
        if (!this.valueDom) {
          this.valueDom = document.getElementById('value-area').children[0]
        }
        return this.valueDom
      },
      /**
       * 定位文本
       */
      setPosition () {
        let dom = this.getDom()
        let index = this.config.finder.index
        let start = this.config.finder.positions[index]
        let end = start + this.config.finder.word.length
        this.setSelectionRange(dom, start, end)
      },
      /**
       * 选中文本
       */
      setSelectionRange (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
          input.focus()
          input.setSelectionRange(selectionStart, selectionEnd)
        } else if (input.createTextRange) {
          let range = input.createTextRange()
          range.collapse(true)
          range.moveEnd('character', selectionEnd)
          range.moveStart('character', selectionStart)
          range.select()
        }
      },
      /**
       * 附加文件
       */
      appendFile () {
        let index = this.config.storage.index
        if (index === undefined || index === null) {
          this.$Message.error('请选中文件后进行附加。')
          return
        }
        let model = this.config.storage.data[this.config.storage.index]
        if (model.type === 'DIRECTORY') {
          this.$Message.error('请选中文件后进行附加。')
          return
        }
        this.config.fileEditor.show = true
        this.config.fileEditor.type = 1
        this.config.fileEditor.model.path = this.config.client.config.path
        this.config.fileEditor.model.name = this.config.client.config.path + model.pathSuffix
      },
      /**
       * 合并文件
       */
      concatFile () {
        let index = this.config.storage.index
        if (index === undefined || index === null) {
          this.$Message.error('请选择合并的目标文件。')
          return
        }
        let model = this.config.storage.data[index]
        if (model.type === 'DIRECTORY') {
          this.$Message.error('请选中文件后进行附加。')
          return
        }
        this.config.fileConcatEditor.show = true
        let config = this.config.servers[this.config.index]
        this.config.fileConcatEditor.client = new Hdfs(config)
        this.config.fileConcatEditor.target = this.config.client.config.path + model.pathSuffix
      }
    }
  }
</script>

<style scoped>

</style>
