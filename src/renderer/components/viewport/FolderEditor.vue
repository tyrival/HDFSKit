<template>
    <Modal v-model="config.folderEditor.show"
           title="创建文件夹"
           width="350"
           :styles="{top: '20px'}">
        <Form :model="config.folderEditor.model" :label-width="60">
            <FormItem label="文件夹名">
                <Input v-model="config.folderEditor.model.name"
                       size="default"></Input>
            </FormItem>
            <FormItem label="权限">
                <Input v-model="config.folderEditor.model.option.octal"
                       size="default"
                       placeholder="000 ~ 777"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="cancelModal">取 消</Button>
            <Button type="primary" size="default" @click="saveFolder">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'FolderEditor',
    props: ['config'],
    methods: {
      saveFolder () {
        if (!this.config.folderEditor.model.name) {
          this.$Message.error({
            content: '错误: 请输入文件夹名称。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.folderEditor.model.path + this.config.folderEditor.model.name
        let option = this.config.folderEditor.model.option
        this.config.client.mkdirs(path, option)
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.folderEditor.show = false
              this.$Message.success('新增文件夹成功。')
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
        this.config.folderEditor.show = false
      }
    },
    watch: {
      'config.folderEditor.show': function (val) {
        if (!val) {
          this.$set(this.config.folderEditor, 'model', {name: null, folder: null, path: null, option: {octal: null}})
        }
      }
    }
  }
</script>
