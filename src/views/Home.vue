<template>
  <div class="home ma-4">
    <v-row class="d-flex mt-10">
      <v-col cols="12" sm="6" lg="3" v-for="item in tags" :key="item.title" align-self="stretch">
        <v-card :color="item.color">
          <div class="d-flex justify-space-between align-center py-8 px-6">
            <h2 class="white--text">{{item.title}}</h2>
            <h2 class="white--text">{{item.count}}</h2>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="d-flex mt-10">
      <v-col md="7" cols="12">
        <v-card class="pa-4">
          <v-chip outlined color="primary">
            <v-icon left>mdi-file-word-box-outline</v-icon>
            <h3>关键词概览</h3>
          </v-chip>

          <v-data-table
            :loading="loading"
            class="mt-4"
            :headers="headers"
            :items="desserts"
            :items-per-page="5"
          >
            <template v-slot:item.days="{item}">{{daysFormat(item)}}</template>
            <template v-slot:item.end_date="{item}">{{endDateFormat(item)}}</template>
            <template v-slot:item.operate="{item}">
              <v-tooltip right>
                <template v-slot:activator="{on, attr}">
                  <v-icon
                    color="primary"
                    v-bind="attr"
                    v-on="on"
                    @click="$router.push({'path':'/keyword', 'query':{key: item.name}})"
                  >mdi-eye</v-icon>
                </template>
                查看详情
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col md="5" cols="12" :order="$vuetify.breakpoint.smAndDown?'first':undefined">
        <v-card class="pa-4">
          <v-chip outlined color="deep-purple lighten-1">
            <v-icon left>mdi-download-network-outline</v-icon>
            <h3>今日进度</h3>
          </v-chip>
          <v-list class="mt-4">
            <v-list-item v-for="item in list">
              <v-icon
                :class="item.status==='process'?'loading':''"
                :color="typeFormat(item.status)"
              >{{iconFormat(item.status)}}</v-icon>
              <span class="pl-3">{{item.text}}</span>
              <v-spacer></v-spacer>
              <span>{{textFormat(item.status)}}</span>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { allViews } from '@/api';

export default {
  name: 'Home',
  components: {
  },
  data: () => ({
    loading: false,
    tags: [{
      color: 'primary',
      title: '历史总词数',
      count: 10
    }, {
      color: 'orange',
      title: '今日总词数',
      count: 10
    }, {
      color: 'green',
      title: '已完成',
      count: 10
    }, {
      color: 'red',
      title: '待抓取',
      count: 10
    }],
    headers: [
      {
        text: '关键词',
        align: 'start',
        sortable: false,
        value: 'keyword',
      },
      { text: '结果总数', value: 'counts' },
      { text: '跟踪天数', value: 'days' },
      { text: '最后跟踪日期', value: 'end_date' },
      { text: '操作', value: 'operate', sortable: false }
    ],
    desserts: [],
    list: [{
      text: 'flores simuladas',
      status: 'success'
    }, {
      text: 'cinta para el pelo',
      status: 'process'
    }, {
      text: 'pulseras',
      status: 'wait'
    }]
  }),
  methods: {
    async fetchData() {
      this.loading = true
      const res = await allViews();
      console.log(res);
      this.desserts = res
      this.loading = false
    },
    async details(item) {

    },
    daysFormat(item) {
      let start = this.$dayjs.unix(item.start_date)
      let end = this.$dayjs.unix(item.end_date)
      return this.$dayjs(start).from(end, true)
    },
    endDateFormat(item) {
      return this.$dayjs.unix(item.end_date).format('YYYY-M-D HH:mm')
    },
    typeFormat(val) {
      switch (val) {
        case 'success':
          return val
          break;
        case 'process':
          return 'orange'
          break;
        case 'wait':
          return 'gray'
          break
      }
    },
    iconFormat(val) {
      switch (val) {
        case 'success':
          return 'mdi-check-bold'
          break;
        case 'process':
          return 'mdi-loading'
          break
        case 'wait':
          return 'mdi-circle-medium'
          break
      }
    },
    textFormat(val) {
      switch (val) {
        case 'success':
          return '已完成'
          break;
        case 'process':
          return '进行中'
          break
        case 'wait':
          return '等待'
          break
      }
    }

  },
  created() {
    this.fetchData()
  }

}
</script>
<style lang="scss" scoped>
@keyframes loading {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading {
  animation: loading 1.5s infinite linear;
}
</style>
