<template>
    <Modal v-model="config.ownerEditor.show"
           title="设置所有者"
           width="350"
           :styles="{top: '20px'}">
        <Form  :label-width="60">
            <FormItem label="路径">
                <Input v-model="config.ownerEditor.model.path"
                       size="default"
                       readonly></Input>
            </FormItem>
            <FormItem label="所有者">
                <Input v-model="config.ownerEditor.model.owner"
                       size="default"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="config.ownerEditor.show = false">取 消</Button>
            <Button type="primary" size="default" @click="save">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'OwnerEditor',
    props: ['config'],
    methods: {
      save () {
        if (!this.config.ownerEditor.model.owner) {
          this.$Message.error({
            content: '错误: 请输入所有者。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.ownerEditor.model.path
        this.config.client.setOwner(path, {owner: this.config.ownerEditor.model.owner})
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.ownerEditor.show = false
              this.$Message.success('所有者设置成功。')
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
