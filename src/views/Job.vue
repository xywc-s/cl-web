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
      <template v-slot:item.status="{ item }">
        <v-chip :color="item.status | statusFilter">{{job_status[item.status]}}</v-chip>
      </template>
      <template v-slot:item.progress="{ item }">
        <v-progress-circular
          :rotate="-90"
          :size="40"
          :value="(item.progress ? (item.progress/item.cycle): item.progress)*100"
          color="light-blue accent-4"
        >{{item.progress ? `${item.progress}/${item.cycle}`: item.progress}}</v-progress-circular>
      </template>
      <template
        v-slot:item.created_at="{ item }"
      >{{$dayjs(item.created_at).format('YYYY-MM-DD HH:mm')}}</template>
      <template v-slot:item.actions="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="error"
              class="mr-2"
              v-on="on"
              v-bind="attrs"
              @click="deleteItem(item)"
            >mdi-delete</v-icon>
          </template>
          删除
        </v-tooltip>
        <v-tooltip top v-if="is_admin && item.status !== 2">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="success"
              class="mr-2"
              v-on="on"
              v-bind="attrs"
              @click="updateItem(item)"
            >mdi-update</v-icon>
          </template>
          更新
        </v-tooltip>
        <v-tooltip top v-if="is_admin">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              color="primary"
              v-on="on"
              v-bind="attrs"
              @click="copyItem(item)"
            >mdi-content-copy</v-icon>
          </template>
          复制命令
        </v-tooltip>
      </template>
    </v-data-table>
  </section>
</template>

<script>
import { createJob, getAllJobs, deleteJob, updateJob } from '@/api';
export default {
  filters: {
    statusFilter(val) {
      const status_colors = ['', 'amber lighten-2', 'success']
      return status_colors[val]
    }
  },
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
      { text: '创建时间', value: 'created_at' },
      { text: '操作', value: 'actions', sortable: false }
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
    },
    is_admin() {
      return !!this.$route.query.admin
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  mounted() {
    this.initialize()
  },

  methods: {
    async initialize() {
      const data = await getAllJobs()
      this.desserts = data
    },

    async deleteItem(item) {
      const is_delete = confirm('确认删除这项任务吗?')
      if (is_delete) {
        await deleteJob({ id: item._id })
        this.initialize()
      }
    },

    async updateItem(item) {
      await updateJob(item)
      this.initialize()
    },

    copyItem(item) {
      let keyword, keyword_arr = item.keyword.split(' ');
      if (keyword_arr.length > 1) {
        keyword = keyword_arr.join('-')
      } else {
        keyword = keyword_arr[0]
      }
      let aux = document.createElement("input");
      aux.setAttribute("value", `scrapy crawl mercador -a keyword=${keyword}`);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
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
