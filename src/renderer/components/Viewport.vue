<template>
	<div class="viewport" :style="calcStyle">
		<ServerPanel :config="config"></ServerPanel>
		<FilePanel ref="filePanel" :config="config"></FilePanel>
		<ValuePanel :config="config"></ValuePanel>
		<ServerEditor :config="config"></ServerEditor>
		<FileEditor :config="config"></FileEditor>
		<FolderEditor :config="config"></FolderEditor>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.less'
  import OSUtils from '../utils/OSUtils'
  import ServerPanel from './viewport/ServerPanel'
  import FilePanel from './viewport/FilePanel'
  import ValuePanel from './viewport/ValuePanel'
  import ServerEditor from './viewport/ServerEditor'
  import FileEditor from './viewport/FileEditor'
  import FolderEditor from './viewport/FolderEditor'

  export default {
    name: 'Viewport',
    data () {
      return {
        config: {
          // 服务器信息列表
          servers: null,
          // 当前服务器索引
          index: null,
          // 当前服务器连接客户端
          client: null,
          // 服务器信息编辑窗口
          serverEditor: {
            show: false,
            index: null,
            model: {
              // HDFS/HIVE
              type: 'HDFS',
              name: null,
              host: null,
              port: null,
              path: null,
              user: null
            }
          },
          // 路径存储
          storage: {
            data: null,
            index: null,
            value: null
          },
          finder: {
            word: '',
            index: 0,
            positions: null
          },
          fileEditor: {
            show: false,
            // 0 - 新建文件 / 1 - 附加文件
            type: 0,
            model: {
              name: '',
              path: null,
              file: null
            }
          },
          folderEditor: {
            show: false,
            model: {
              name: '',
              path: null
            }
          }
        }
      }
    },
    mounted () {
      this.$db.find({}, (_, docs) => {
        if (docs && docs.length) {
          this.config.servers = docs
        } else {
          this.config.servers = []
        }
      })
    },
    computed: {
      calcStyle () {
        return OSUtils.getOsInfo().name === 'Mac' ? 'top:22px' : 'top:0'
      }
    },
    components: {
      'ServerPanel': ServerPanel,
      'FilePanel': FilePanel,
      'ValuePanel': ValuePanel,
      'ServerEditor': ServerEditor,
      'FileEditor': FileEditor,
      'FolderEditor': FolderEditor
    }
  }
</script>
