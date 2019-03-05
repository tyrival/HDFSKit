<template>
	<div v-if="config.storage"
	     class="file-panel">
		<div class="filter">
			<Input suffix="ios-search"
			       v-model="filterWord"
			       placeholder="请输入筛选条件"/>
		</div>
		<div class="file-list">
			<Menu theme="light"
			      :active-name="config.index"
			      @on-select="selectFile">
				<template v-for="(item, i) in config.storage">
					<MenuItem :name="i"
					          v-show="filterFile(item)">
						{{item.pathSuffix}}
					</MenuItem>
				</template>
			</Menu>
		</div>
		<div class="menu">
			<ButtonGroup size="small" shape="circle">
				<Button type="primary"
				        custom-icon="icon iconfont icon-plus"
				        @click="createFile"></Button>
				<Button type="primary"
				        custom-icon="icon iconfont icon-minus"
				        @click="deleteFile"></Button>
			</ButtonGroup>
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
