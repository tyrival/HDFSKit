<template>
    <div v-if="config.storage.data"
         class="file-panel">
        <div class="filter">
            <Button type="default"
                    custom-icon="icon iconfont icon-up"
                    :disabled="disableUpButton()"
                    @click="upFolder"></Button>
            <Input suffix="icon iconfont icon-filter"
                   v-model="filterWord"
                   placeholder="请输入筛选条件" clearable/>
        </div>
        <div class="file-list">
            <template v-for="(item, i) in config.storage.data">
                <div v-show="filterFile(item)"
                     class="file-item"
                     :class="config.storage.index === i ? 'active' : ''"
                     @click="selectFile(i)"
                     @dblclick="openFile(i)">
                    <i class="icon iconfont" :class="calcIcon(item.type)"/>
                    {{item.pathSuffix}}
                </div>
            </template>
        </div>
        <div class="menu">
            <ButtonGroup size="small" shape="circle">
                <Button type="primary"
                        custom-icon="icon iconfont icon-add-folder"
                        @click="createFolder"></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-add-file"
                        @click="createFile"></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-delete"
                        @click="deleteFile"></Button>
                <Button type="primary"
                        custom-icon="icon iconfont icon-rename"
                        @click="renameFile"></Button>
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
  import '../../assets/styles/viewport/file-panel.less'
  import Hdfs from '../client/hdfs'

  export default {
    name: 'FilePanel',
    props: ['config'],
    data () {
      return {
        filterWord: ''
      }
    },
    methods: {
      /**
       * 过滤服务器信息
       * @param item
       * @returns {boolean}
       */
      filterFile (item) {
        if (this.filterWord === null || this.filterWord === undefined) {
          return true
        }
        if (item.pathSuffix.toLowerCase().indexOf(this.filterWord.toLowerCase()) >= 0) {
          return true
        }
        return false
      },
      /**
       * 判断是否显示向上按钮
       */
      disableUpButton () {
        let index = this.config.index
        if (index === undefined || index === null) {
          return true
        }
        let serverPath = this.config.servers[index].path
        let clientPath = this.config.client.config.path
        return serverPath === clientPath
      },
      /**
       * 判断文件图标
       */
      calcIcon (type) {
        switch (type) {
          case 'DIRECTORY':
            return 'icon-folder'
          case 'FILE':
            return 'icon-file'
          default:
            return ''
        }
      },
      /**
       * 转到上级文件夹
       */
      upFolder () {
        this.resetValue()
        let config = {}
        config.host = this.config.client.config.host
        config.port = this.config.client.config.port
        let path = this.config.client.config.path
        path = path.substring(0, path.length - 1)
        config.path = path.substring(0, path.lastIndexOf('/')) + '/'
        this.config.client = new Hdfs(config)
      },
      /**
       * 选择文件
       */
      selectFile (index) {
        if (this.config.storage.index === index) {
          return
        }
        this.config.storage.index = index
        this.resetValue()
      },
      /**
       * 选择文件
       */
      openFile (index) {
        this.config.storage.index = index
        let model = this.config.storage.data[index]
        let type = model.type
        if (type === 'DIRECTORY') {
          this.resetValue()
          this.openFolder()
        } else {
          this.loadFile()
        }
      },
      /**
       * 打开文件夹
       */
      openFolder () {
        let folder = this.config.storage.data[this.config.storage.index]
        let config = {}
        config.host = this.config.client.config.host
        config.port = this.config.client.config.port
        config.path = this.config.client.config.path + folder.pathSuffix + '/'
        this.config.client = new Hdfs(config)
      },
      /**
       * 读取文件
       */
      loadFile () {
        let file = this.config.storage.data[this.config.storage.index]
        let folderPath = this.config.client.config.path
        let filePath = folderPath + file.pathSuffix
        this.config.client.open(filePath)
          .then(response => {
            if (response.status === 200) {
              this.config.storage.value = response.data
            }
          })
          .catch(_ => {
            let message = '未能打开选中的文件。'
            this.$Message.error(message)
          })
      },
      /**
       * 新增文件
       */
      createFile () {
        this.config.fileEditor.show = true
        this.config.fileEditor.type = 0
        this.config.fileEditor.model.path = this.config.client.config.path
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
        this.config.fileEditor.model.name = model.pathSuffix
      },
      /**
       * 删除文件
       */
      deleteFile () {
        let index = this.config.storage.index
        if (index === undefined || index === null) {
          this.$Message.error('请选择需要删除的文件。')
          return
        }
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除选中的文件？',
          closable: true,
          onOk: () => {
            let path = this.config.client.config.path + this.config.storage.data[this.config.storage.index].pathSuffix
            this.config.client.delete(path)
              .then(response => {
                if (response.status === 200) {
                  this.$Message.success('删除成功。')
                  this.loadFileList()
                }
              })
          }
        })
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
      },
      /**
       * 新增文件夹
       */
      createFolder () {
        this.config.folderEditor.show = true
        this.config.folderEditor.model.path = this.config.client.config.path
      },
      /**
       * 重置值面板
       */
      resetValue () {
        this.config.storage.value = null
        this.config.finder.index = 0
        this.config.finder.word = ''
        this.config.finder.positions = null
      },
      /**
       * 加载文件列表
       */
      loadFileList () {
        this.config.storage.index = null
        this.config.client.listStatus(this.config.client.config.path)
          .then(response => {
            let folder = []
            let files = []
            let array = response.data.FileStatuses.FileStatus
            if (array && array.length) {
              for (let i = 0; i < array.length; i++) {
                let item = array[i]
                if (item.type === 'DIRECTORY') {
                  folder.push(item)
                } else {
                  files.push(item)
                }
              }
            }
            this.config.storage.data = folder.concat(files)
          })
          .catch(_ => {
            let message = '连接服务器失败，请检查服务器状态和网络连接。'
            this.$Message.error(message)
          })
      },
      /**
       * 重命名文件/文件夹
       */
      renameFile () {
        let index = this.config.storage.index
        if (index === undefined || index === null) {
          this.$Message.error('请选择需要重命名的文件/文件夹。')
          return
        }
        this.config.fileRenameEditor.show = true
        let path = this.config.client.config.path
        let name = this.config.storage.data[this.config.storage.index].pathSuffix
        this.config.fileRenameEditor.model.path = path + name
        this.config.fileRenameEditor.model.destination = path + name
      }
    },
    watch: {
      'config.client': function () {
        this.loadFileList()
      }
    }
  }
</script>
