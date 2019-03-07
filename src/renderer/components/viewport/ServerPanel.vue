<template>
	<div class="server-panel">
		<div class="filter">
			<Input suffix="icon iconfont icon-filter"
			       v-model="filterWord"
			       placeholder="请输入筛选条件" clearable/>
		</div>
		<div class="server-list">
			<Menu theme="light"
			      :active-name="config.index"
			      @on-select="selectServer">
				<template v-for="(item, i) in config.servers">
					<MenuItem :name="i"
					          v-show="filterServer(item)">
						<i class="icon iconfont" :class="item.type ==='HDFS' ? 'icon-hdfs' : 'icon-hive'"/>
						{{item.name}}
					</MenuItem>
				</template>
			</Menu>
		</div>
		<div class="menu">
			<ButtonGroup size="small" shape="circle">
				<Button type="primary"
				        custom-icon="icon iconfont icon-plus"
				        @click="addServer"></Button>
				<Button type="primary"
				        custom-icon="icon iconfont icon-minus"
				        @click="deleteServer"></Button>
				<Button type="primary"
				        custom-icon="icon iconfont icon-edit"
				        @click="editServer"></Button>
				<Button type="primary"
				        custom-icon="icon iconfont icon-link"
				        @click="connectServer"></Button>
			</ButtonGroup>
		</div>
	</div>
</template>

<script>
  import '../../assets/styles/viewport/server-panel.less'
  import Hdfs from '../client/hdfs'

  export default {
    name: 'ServerPanel',
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
      filterServer (item) {
        if (this.filterWord === null || this.filterWord === undefined) {
          return true
        }
        if (item.name.toLowerCase().indexOf(this.filterWord.toLowerCase()) >= 0) {
          return true
        }
        return false
      },
      /**
       * 选择服务器
       */
      selectServer (name) {
        if (this.config.index === name) {
          return
        }
        this.config.index = name
        this.connectServer()
      },
      /**
       * 连接服务器
       */
      connectServer () {
        let config = this.config.servers[this.config.index]
        this.config.client = new Hdfs(config)
      },
      /**
       * 新增服务器
       */
      addServer () {
        this.config.serverEditor.show = true
      },
      /**
       * 编辑服务器
       */
      editServer () {
        let index = this.config.index
        if (index === undefined || index === null) {
          this.$Message.error('未选择服务器对象。')
          return
        }
        this.config.serverEditor.show = true
        this.config.serverEditor.index = index
        this.$set(this.config.serverEditor, 'model', this.config.servers[index])
      },
      /**
       * 删除服务器
       */
      deleteServer () {
        let index = this.config.index
        if (index === undefined || index === null) {
          this.$Message.error('未选择服务器对象。')
          return
        }
        this.$Modal.confirm({
          title: '警告',
          content: '确定删除选中的服务器信息？',
          closable: true,
          onOk: () => {
            this.config.servers.splice(index, 1)
            this.config.index = null
            this.$dbServers(this.config.servers)
          }
        })
      }
    }
  }
</script>
