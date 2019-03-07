<template>
	<div class="viewport" :style="calcStyle">
		<ServerPanel :config="config"></ServerPanel>
		<FilePanel :config="config"></FilePanel>
		<ServerEditor :config="config"></ServerEditor>
	</div>
</template>

<script>
  import '../assets/styles/viewport/main.less'
  import OSUtils from '../utils/OSUtils'
  import ServerPanel from './viewport/ServerPanel'
  import FilePanel from './viewport/FilePanel'
  import ServerEditor from './viewport/ServerEditor'

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
      'ServerEditor': ServerEditor
    }
  }
</script>
