<template>
    <Modal v-model="config.fileEditor.show"
           :title="config.fileEditor.type === 0 ? '新增文件' : '附加文件'"
           width="350"
           :styles="{top: '20px'}">
        <Form :model="config.fileEditor.model" :label-width="60">
            <FormItem label="文件名">
                <Input v-model="config.fileEditor.model.name"
                       size="default"
                       :readonly="config.fileEditor.type === 1"></Input>
            </FormItem>
            <FormItem v-if="config.fileEditor.model.file" label="附件">
                <div v-if="config.fileEditor.model.file">
                    {{ config.fileEditor.model.file.name }}
                    <Button type="text" icon="md-close" @click="deleteFile"></Button>
                </div>
            </FormItem>
        </Form>
        <Upload multiple
                v-if="!config.fileEditor.model.file"
                :before-upload="beforeUpload"
                type="drag"
                action="">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或将文件拖拽到此处</p>
            </div>
        </Upload>
        <div slot="footer">
            <Button size="default" @click="cancelModal">取 消</Button>
            <Button type="primary" size="default" @click="saveFile">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'FileEditor',
    props: ['config'],
    methods: {
      beforeUpload (file) {
        this.config.fileEditor.model.file = file
        if (!this.config.fileEditor.model.name) {
          this.config.fileEditor.model.name = file.name
        }
        return false
      },
      deleteFile () {
        this.config.fileEditor.model.file = null
      },
      saveFile () {
        this.$Spin.show()
        let path = this.config.fileEditor.model.path + this.config.fileEditor.model.name
        switch (this.config.fileEditor.type) {
          case 0:
            this.config.client.create(path, this.config.fileEditor.model.file)
              .then(response => {
                this.$Spin.hide()
                if (response.status === 201) {
                  this.config.fileEditor.show = false
                  this.$Message.success('新增文件成功。')
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
            break
          case 1:
            if (!this.config.fileEditor.model.file) {
              this.$Message.error({
                content: '请选中需要附加的文件。',
                duration: 3
              })
              return
            }
            this.config.client.append(path, this.config.fileEditor.model.file)
              .then(response => {
                this.$Spin.hide()
                if (response.status === 200) {
                  this.config.fileEditor.show = false
                  this.$Message.success('附加文件成功。')
                }
              })
              .catch(error => {
                this.$Spin.hide()
                this.$Message.error({
                  content: '错误' + error.response.status + ': ' + error.response.statusText,
                  duration: 3
                })
              })
            break
          default:
            break
        }
      },
      cancelModal () {
        this.config.fileEditor.show = false
      }
    },
    watch: {
      'config.fileEditor.show': function (val) {
        if (!val) {
          this.$set(this.config.fileEditor, 'model', {name: null, file: null, path: null})
        }
      }
    }
  }
</script>

<style scoped>

</style>
