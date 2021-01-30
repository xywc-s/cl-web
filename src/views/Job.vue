<template>
  <section id="job" class="ma-4">
    <v-data-table :headers="headers" :items="desserts" sort-by="strategy">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>计划任务</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" width="600px" max-width="90%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn disabled color="primary" class="mb-2" v-bind="attrs" v-on="on">添加计划任务</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">添加计划任务</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.name" label="关键词"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="editedItem.strategy"
                        :hint="`${editedItem.strategy.description}`"
                        :items="items"
                        item-text="name"
                        label="策略"
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
                <v-btn color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: '关键词',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: '策略', value: 'strategy' },
      { text: '周期', value: 'cycle' },
      { text: '状态', value: 'status' },
      { text: '进度', value: 'progress' },
      { text: '创建时间', value: 'created_at' },
      { text: '操作', value: 'actions', sortable: false },
    ],
    desserts: [],
    editedItem: {
      name: '',
      strategy: {
        value: 0,
        name: '有效追踪',
        description: '第一次完整抓取所有数据，后续对有销量的数据进行数据跟踪'
      },
      cycle: 7,
    },
    defaultItem: {
      name: '',
      strategy: {
        value: 0,
        name: '有效追踪',
        description: '第一次完整抓取所有数据，后续对有销量的数据进行数据跟踪'
      },
      cycle: 7,
    },
  }),

  computed: {
    items() {
      return [{
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
      }]
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
    initialize() {
      this.desserts = [
        {
          name: 'Frozen Yogurt',
          strategy: 159,
          cycle: 6.0,
          status: 24,
          progress: 4.0,
          created_at: this.$dayjs().format('YYYY-MM-DD HH:mm')
        },
        {
          name: 'Ice cream sandwich',
          strategy: 237,
          cycle: 9.0,
          status: 37,
          progress: 4.3,
          created_at: this.$dayjs().format('YYYY-MM-DD HH:mm')
        }
      ]
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },

    save() {
      //TODO: 添加
      this.editedItem.cycle = this.editedItem.cycle.name
      this.desserts.push(this.editedItem)
      this.close()
    },
  },
}
</script>
