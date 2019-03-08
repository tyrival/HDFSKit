<template>
    <Modal v-model="config.replicationEditor.show"
           title="设置副本"
           width="350"
           :styles="{top: '20px'}">
        <Form  :label-width="60">
            <FormItem label="路径">
                <Input v-model="config.replicationEditor.model.path"
                       size="default"
                       readonly></Input>
            </FormItem>
            <FormItem label="副本数">
                <InputNumber :min="1"
                             size="default"
                             placeholder="SHORT"
                             style="width: 100%"
                             v-model="config.fileEditor.model.replication"></InputNumber>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="config.replicationEditor.show = false">取 消</Button>
            <Button type="primary" size="default" @click="save">确 定</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'ReplicationEditor',
    props: ['config'],
    methods: {
      save () {
        if (!this.config.replicationEditor.model.replication) {
          this.$Message.error({
            content: '错误: 请输入副本数。',
            duration: 3
          })
          return
        }
        this.$Spin.show()
        let path = this.config.replicationEditor.model.path
        this.config.client.setReplication(path, {replication: this.config.replicationEditor.model.replication})
          .then(response => {
            this.$Spin.hide()
            if (response.status === 200) {
              this.config.replicationEditor.show = false
              this.$Message.success('副本数设置成功。')
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
