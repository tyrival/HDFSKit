<template>
    <Modal v-model="config.fileRenameEditor.show"
           title="移动/重命名文件"
           width="700"
           :styles="{top: '20px'}">
        <Form :model="config.fileRenameEditor.model" :label-width="60">
            <FormItem label="目标路径">
                <Input v-model="config.fileRenameEditor.model.destination"
                       size="default"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="cancelModal">取 消</Button>
            <Button type="primary" size="default" @click="save">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'FileRenameEditor',
    props: ['config'],
    methods: {
      save () {
        if (!this.config.fileRenameEditor.model.destination) {
          this.$Message.error({
            content: '错误: 请输入新路径。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.fileRenameEditor.model.path
        let destination = this.config.fileRenameEditor.model.destination
        this.config.client.rename(path, destination)
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.fileRenameEditor.show = false
              this.$Message.success('操作完成。')
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
      },
      cancelModal () {
        this.config.fileRenameEditor.show = false
      }
    },
    watch: {
      'config.fileRenameEditor.show': function (val) {
        if (!val) {
          this.$set(this.config.fileRenameEditor, 'model', {name: null, path: null})
        }
      }
    }
  }
</script>
