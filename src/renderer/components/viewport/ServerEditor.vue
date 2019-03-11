<template>
	<Modal v-model="config.serverEditor.show"
	       title="服务器信息"
	       width="350"
	       :styles="{top: '20px'}">
		<Form :model="config.serverEditor.model" :label-width="60" ref="serverEditorForm">
			<FormItem label="类型" v-show="false">
				<RadioGroup v-model="config.serverEditor.model.type">
					<Radio label="HDFS">HDFS</Radio>
					<Radio label="HIVE">HIVE</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="名称">
				<Input v-model="config.serverEditor.model.name"
				       size="default"
				       placeholder="默认"></Input>
			</FormItem>
			<template v-if="config.serverEditor.model.type === 'HDFS'">
				<FormItem label="主机">
					<Input v-model="config.serverEditor.model.host"
					       size="default"
					       placeholder="localhost"></Input>
				</FormItem>
				<FormItem label="端口">
					<Input v-model="config.serverEditor.model.port"
					       size="default"
					       placeholder="50070"></Input>
				</FormItem>
				<FormItem label="路径">
					<Input v-model="config.serverEditor.model.path"
					       size="default"
					       placeholder="/"></Input>
				</FormItem>
				<FormItem label="用户">
					<Input v-model="config.serverEditor.model.user"
					       size="default"></Input>
				</FormItem>
			</template>
		</Form>
		<div slot="footer">
			<Button size="default" @click="cancelModal">取 消</Button>
			<Button type="primary" size="default" @click="saveServer">确 定</Button>
		</div>
	</Modal>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'ServerEditor',
    props: ['config'],
    methods: {
      saveServer () {
        let index = this.config.serverEditor.index
        let model = _.cloneDeep(this.config.serverEditor.model)
        if (!model.name) {
          model.name = '默认'
        }
        if (!model.host) {
          model.host = 'localhost'
        }
        if (!model.port) {
          model.port = '50070'
        }
        if (!model.path) {
          model.path = '/'
        }
        if (index === undefined || index === null) {
          this.config.servers.push(model)
        } else {
          this.config.servers.splice(index, 1, model)
        }
        this.$dbServers(this.config.servers)
        if (this.config.serverEditor.index === this.config.index) {
          this.config.index = null
          this.config.client = null
        }
        this.config.serverEditor.show = false
      },
      cancelModal () {
        this.config.serverEditor.show = false
      }
    },
    watch: {
      'config.serverEditor.show': function (val) {
        if (!val) {
          this.config.serverEditor.index = null
          this.$set(this.config.serverEditor, 'model', {
            type: 'HDFS',
            name: null,
            host: null,
            port: null,
            path: null,
            user: null
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
