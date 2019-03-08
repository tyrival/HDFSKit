<template>
	<Modal v-model="config.fileConcatEditor.show"
	       title="来源文件"
	       width="550"
	       :styles="{top: '20px'}">
		<Form :label-width="60">
			<FormItem label="目标文件">
				<Input v-model="config.fileConcatEditor.target"
				       size="default"
				       readonly></Input>
			</FormItem>
			<FormItem label="来源文件">
				<Input v-model="config.fileConcatEditor.source"
				       size="default"
				       readonly></Input>
			</FormItem>
		</Form>
		<div class="file-concat">
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
				<template v-for="(item, i) in data">
					<div v-show="filterFile(item)"
					     class="file-item"
					     :class="index === i ? 'active' : ''"
					     @click="selectFile(i)">
						<i class="icon iconfont" :class="calcIcon(item.type)"/>
						{{item.pathSuffix}}
					</div>
				</template>
			</div>
		</div>
		<div slot="footer">
			<Button size="default" @click="config.fileConcatEditor.show = false">取 消</Button>
			<Button type="primary" size="default" @click="save">确 定</Button>
		</div>
	</Modal>
</template>

<script>
  import '../../assets/styles/viewport/file-concat.less'
  import Hdfs from '../client/hdfs'

  export default {
    name: 'FileConcatEditor',
    props: ['config'],
    data () {
      return {
        data: null,
        index: null,
        filterWord: null
      }
    },
    methods: {
      /**
       * 判断是否显示向上按钮
       */
      disableUpButton () {
        let index = this.config.index
        if (index === undefined || index === null) {
          return true
        }
        let client = this.config.fileConcatEditor.client
        if (!client) {
          return true
        }
        let serverPath = this.config.servers[index].path
        let clientPath = this.config.fileConcatEditor.client.config.path
        return serverPath === clientPath
      },
      /**
       * 转到上级文件夹
       */
      upFolder () {
        this.index = null
        let config = {}
        config.host = this.config.fileConcatEditor.client.config.host
        config.port = this.config.fileConcatEditor.client.config.port
        let path = this.config.fileConcatEditor.client.config.path
        path = path.substring(0, path.length - 1)
        config.path = path.substring(0, path.lastIndexOf('/')) + '/'
        this.config.fileConcatEditor.client = new Hdfs(config)
        this.config.fileConcatEditor.source = config.path
      },
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
       * 选择文件
       */
      selectFile (index) {
        this.index = index
        let model = this.data[index]
        let type = model.type
        this.config.fileConcatEditor.source = this.config.fileConcatEditor.client.config.path + model.pathSuffix
        if (type === 'DIRECTORY') {
          this.config.fileConcatEditor.source += '/'
          this.openFolder()
        }
      },
      /**
       * 打开文件夹
       */
      openFolder () {
        let folder = this.data[this.index]
        let config = {}
        config.host = this.config.fileConcatEditor.client.config.host
        config.port = this.config.fileConcatEditor.client.config.port
        config.path = this.config.fileConcatEditor.client.config.path + folder.pathSuffix + '/'
        this.config.fileConcatEditor.client = new Hdfs(config)
        this.index = null
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
       * 保存
       */
      save () {
        let source = this.config.fileConcatEditor.source
        if (source.endsWith('/')) {
          this.$Message.error({
            content: '请选中合并的来源文件。',
            duration: 3
          })
          return
        }
        let target = this.config.fileConcatEditor.target
        if (target === source) {
          this.$Message.error({
            content: '来源文件和目标文件不可相同。',
            duration: 3
          })
          return
        }
        this.config.client.concat(target, source)
          .then(response => {
            if (response.status === 200) {
              this.$Message.success('合并成功。')
              this.config.fileConcatEditor.show = false
            }
          })
          .catch(error => {
            if (error) {
              this.$Message.error({
                content: '错误' + error.response.status + ': ' + error.response.statusText,
                duration: 3
              })
            }
          })
      },
      /**
       * 加载文件列表
       */
      loadFileList () {
        let client = this.config.fileConcatEditor.client
        let path = this.config.fileConcatEditor.client.config.path
        client.listStatus(path)
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
            this.data = folder.concat(files)
          })
          .catch(_ => {
            let message = '连接服务器失败，请检查服务器状态和网络连接。'
            this.$Message.error(message)
          })
      },
      /**
       * 隐藏弹窗
       */
      cancelModal () {
        debugger
        this.config.fileConcatEditor.show = false
      }
    },
    watch: {
      'config.fileConcatEditor.show': function (val) {
        if (!val) {
          this.config.fileConcatEditor.client = null
          this.config.fileConcatEditor.source = null
          this.config.fileConcatEditor.target = null
        }
      },
      'config.fileConcatEditor.client': function (val) {
        if (!val) {
          return
        }
        this.loadFileList()
      }
    }
  }
</script>
