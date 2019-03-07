<template>
    <Modal v-model="config.fileEditor.show"
           title="信息"
           width="350"
           :styles="{top: '20px'}">
        <Upload multiple
                :before-upload="beforeUpload"
                type="drag"
                action="">
            <div style="padding: 20px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>Click or drag files here to upload</p>
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
        debugger
        this.config.fileEditor.model.file = file
        return false
      },
      saveFile () {
        // let index = this.config.fileEditor.index
      },
      cancelModal () {
        this.config.fileEditor.show = false
      }
    },
    watch: {
      'config.fileEditor.show': function (val) {
        if (!val) {
          this.config.fileEditor.index = null
          this.$set(this.config.fileEditor, 'model', {file: null})
        }
      }
    }
  }
</script>

<style scoped>

</style>
