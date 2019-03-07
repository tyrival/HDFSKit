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
                        custom-icon="icon iconfont icon-plus"
                        @click=""></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-minus"
                        @click=""></Button>
            </ButtonGroup>
        </div>
    </div>
</template>

<script>
  import '../../assets/styles/viewport/value-panel.less'

  export default {
    name: 'ValuePanel',
    props: ['config'],
    data () {
      return {
        valueDom: null
      }
    },
    methods: {
      changeWord () {
        this.config.finder.index = 0
        this.config.finder.positions = null
      },
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
      prevPosition () {
        this.config.finder.index--
        this.setPosition()
      },
      nextPosition () {
        this.config.finder.index++
        this.setPosition()
      },
      getDom () {
        if (!this.valueDom) {
          this.valueDom = document.getElementById('value-area').children[0]
        }
        return this.valueDom
      },
      setPosition () {
        let dom = this.getDom()
        let index = this.config.finder.index
        let start = this.config.finder.positions[index]
        let end = start + this.config.finder.word.length
        this.setSelectionRange(dom, start, end)
      },
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
      }
    }
  }
</script>

<style scoped>

</style>
