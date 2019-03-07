<template>
    <div v-if="config.storage"
         class="value-panel">
        <div class="toolbar">
            <Input suffix="ios-search"
                   v-model="filterWord"
                   placeholder="请输入"/>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'ValuePanel'
  }
</script>

<style scoped>

</style>
