<template>
	<Modal v-model="config.symLinkEditor.show"
	       title="设置符号链接"
	       width="600"
	       :styles="{top: '20px'}">
		<Form :model="config.symLinkEditor.model" :label-width="80">
			<FormItem label="路径">
				<Input v-model="config.symLinkEditor.model.path"
				       size="default"
				       readonly></Input>
			</FormItem>
			<FormItem label="链接路径">
				<Input v-model="config.symLinkEditor.model.destination"
				       size="default"></Input>
			</FormItem>
			<FormItem label="创建父路径">
				<i-switch v-model="config.symLinkEditor.model.option.createParent" size="large">
					<span slot="open">On</span>
					<span slot="close">Off</span>
				</i-switch>
			</FormItem>
		</Form>
		<div slot="footer">
			<Button size="default" @click="config.symLinkEditor.show = false">取 消</Button>
			<Button type="primary" size="default" @click="save">确 定</Button>
		</div>
	</Modal>
</template>

<script>
  export default {
    name: 'SymLinkEditor',
    props: ['config'],
    methods: {
      save () {
        let destination = this.config.symLinkEditor.model.destination
        if (!destination) {
          this.$Message.error({
            content: '错误: 请输入符号链接路径。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.symLinkEditor.model.path
        this.config.client.createSymLink(path, destination, this.config.symLinkEditor.model.option)
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.symLinkEditor.show = false
              this.$Message.success('符号链接创建成功。')
              this.$parent.$refs.filePanel.loadFileList()
            }
          })
          .catch(error => {
            this.$Spin.hide()
            this.$Message.error({
              content: '错误' + error.response.status + ': ' + error.response.statusText,
              duration: 3
            })
          })
      }
    }
  }
</script>
