<template>
  <section id="job" class="ma-4">
    <v-data-table :headers="headers" :items="desserts" sort-by="strategy">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <caption>计划任务</caption>
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" width="600px" max-width="90%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">添加计划任务</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">添加任务</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.keyword" label="关键词"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="editedItem.strategy"
                        :hint="`${editedItem.strategy.description}`"
                        :items="strategies"
                        item-text="name"
                        label="策略"
                        disabled
                        persistent-hint
                        return-object
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="editedItem.cycle" label="周期(天)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn :disabled="!formIsValid" color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.strategy="{ item }">{{strategies_descriptions[item.strategy]}}</template>
      <template v-slot:item.status="{ item }">{{job_status[item.status]}}</template>
      <template
        v-slot:item.progress="{ item }"
      >{{item.progress ? `${item.progress}/${item.cycle}`: item.progress}}</template>
      <template
        v-slot:item.created_at="{ item }"
      >{{$dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}}</template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </section>
</template>

<script>
import { createJob, getAllJobs } from '@/api';
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: '关键词',
        align: 'start',
        sortable: false,
        value: 'keyword',
      },
      { text: '策略', value: 'strategy' },
      { text: '周期(天)', value: 'cycle' },
      { text: '状态', value: 'status', filterable: true },
      { text: '进度', value: 'progress' },
      { text: '创建时间', value: 'created_at' }
    ],
    desserts: [],
    editedItem: {
      keyword: '',
      strategy: {
        value: 0,
        name: '有效追踪',
        description: '第一次完整抓取所有数据，后续对有销量的数据进行数据跟踪'
      },
      cycle: 7,
    },
    defaultItem: {
      keyword: '',
      strategy: {
        value: 0,
        name: '有效追踪',
        description: '第一次完整抓取所有数据，后续对有销量的数据进行数据跟踪'
      },
      cycle: 7,
    },
    strategies: [{
      value: 0,
      name: '有效追踪',
      description: '第一次完整抓取所有数据，后续对有销量的数据进行数据跟踪'
    }, {
      value: 1,
      name: '完整遍历',
      description: '每次都完整抓取所有产品'
    }, {
      value: 2,
      name: '综合捕获',
      description: '每间隔2天重新进行一次完整遍历'
    }],
    job_status: ['等待', '进行中', '已完成']
  }),

  computed: {
    strategies_descriptions() {
      return this.strategies.map(item => { return item.name })
    },
    formIsValid() {
      return (
        this.editedItem.keyword &&
        this.editedItem.cycle
      )
    },
    display_columns() {
      let columns = ['keyword', 'strategy', 'cycle', 'stauts', 'progress', 'created_at']
      columns.push('actions')
      return columns
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  mounted() {
    this.initialize()
    if (this.$route.query.admin) this.headers.push({ text: '操作', value: 'actions', sortable: false })
  },

  methods: {
    async initialize() {
      const data = await getAllJobs()
      this.desserts = data
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('确认删除这项任务吗?') && this.desserts.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },

    async save() {
      let params = Object.assign({}, this.editedItem)
      params.strategy = params.strategy.value
      params.keyword = params.keyword.trim().toLowerCase()
      console.log(params);
      await createJob(params)
      await this.initialize()
      this.close()
    },
  },
}
</script>
