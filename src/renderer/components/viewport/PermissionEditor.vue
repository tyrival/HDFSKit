<template>
    <Modal v-model="config.permissionEditor.show"
           title="设置权限"
           width="500"
           :styles="{top: '20px'}">
        <Form  :label-width="60">
            <FormItem label="路径">
                <Input v-model="config.permissionEditor.path"
                       size="default"
                       readonly></Input>
            </FormItem>
            <FormItem label="权限">
                <Input v-model="config.permissionEditor.octal"
                       size="default"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="config.permissionEditor.show = false">取 消</Button>
            <Button type="primary" size="default" @click="save">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'PermissionEditor',
    props: ['config'],
    methods: {
      save () {
        if (!this.config.permissionEditor.octal) {
          this.$Message.error({
            content: '错误: 请输入权限。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.permissionEditor.path
        this.config.client.setPermission(path, {permission: this.config.permissionEditor.octal})
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.permissionEditor.show = false
              this.$Message.success('权限设置成功。')
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
