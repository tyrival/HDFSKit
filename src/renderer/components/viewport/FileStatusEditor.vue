<template>
    <Modal v-model="config.fileStatusEditor.show"
           title="文件状态"
           width="500"
           :styles="{top: '20px'}">
        <Form :model="config.fileStatusEditor.info" :label-width="60">
            <FormItem label="ID">
                <Input v-model="config.fileStatusEditor.info.fileId"
                       size="default"
                       readonly></Input>
            </FormItem>
            <FormItem label="路径">
                <Input v-model="config.fileStatusEditor.info.path"
                       size="default"
                       readonly></Input>
            </FormItem>
            <FormItem label="类型">
                <Row>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.type"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" style="text-align: center">大小</Col>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.length"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="副本数">
                <Row>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.replication"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" style="text-align: center">块容量</Col>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.blockSize"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="用户组">
                <Row>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.group"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" style="text-align: center">用户</Col>
                    <Col span="10">
                        <FormItem>
                            <Input v-model="config.fileStatusEditor.info.owner"
                                   size="default"
                                   readonly></Input>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="权限">
                <Input v-model="config.fileStatusEditor.info.permission"
                       size="default"
                       readonly></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button size="default" @click="config.fileStatusEditor.show = false">关 闭</Button>
        </div>
    </Modal>
</template>

<script>
  export default {
    name: 'FileStatusEditor',
    props: ['config'],
    watch: {
      'config.fileStatusEditor.show': function (val) {
        if (!val) {
          this.$set(this.config.fileStatusEditor, 'info', {})
        }
      }
    }
  }
</script>
