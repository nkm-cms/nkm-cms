<template>
  <div class="container">
    <el-card>
      <p>欢迎使用nkm-cms内容管理系统，觉得还可以赏个star吧🌝</p>
      <a href="https://github.com/nkm-admin/nkm-cms" target="_blank">https://github.com/nkm-admin/nkm-cms</a>
    </el-card>

    <el-row class="m-t-20px" :gutter="20">
      <el-col :span="8" :xs="24" :sm="24" :md="12" :lg="8">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>

          <ul class="operation-list">
            <li
              v-for="(item, index) in operationList"
              :key="index"
              class="operation-item align-center"
              :class="index > 2 && 'm-t-20px'"
            >
              <router-link :to="item.path">
                <x-svg-icon :icon="item.icon" size="30px" />
                <p class="m-t-10px">{{ item.name }}</p>
              </router-link>
            </li>
          </ul>
        </el-card>
      </el-col>

      <el-col :span="16" :xs="24" :sm="24" :md="12" :lg="16">
        <el-card>
          <template #header>
            <span>文章访问量Top10</span>
          </template>
          功能开发中...
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  data() {
    return {
      operationList: [
        {
          icon: 'dashboard-edit',
          name: '发文章',
          path: '/article/edit'
        },
        {
          icon: 'dashboard-article',
          name: '看文章',
          path: '/article/list'
        },
        {
          icon: 'dashboard-setting',
          name: '个人设置',
          path: '/personal-center'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-list {
  display: flex;
  flex-wrap: wrap;

  .operation-item {
    width: calc(100% / 3);
  }

  .operation-item__icon {
    font-size: 30px;
  }
}
</style>
