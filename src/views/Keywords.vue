<template>
  <section id="keyword-details" class="ma-4 mt-4">
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-autocomplete
          v-model="input_field"
          clearable
          hide-no-data
          :items="items"
          :search-input.sync="search"
          item-text="value"
          item-value="name"
          prepend-inner-icon="mdi-magnify"
          hint="支持模糊查询,如果没有匹配到任何结果,说明当前关键词没有进行爬取,或者爬取后没有找到有销量的产品"
          label="关键词查询"
          @input="searchChange"
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-data-table
      :loading="loading"
      class="mt-0"
      :items="desserts"
      :headers="headers"
      :items-per-page="10"
    >
      <template v-slot:item.img="{item}">
        <v-avatar tile>
          <img :src="item.img" />
        </v-avatar>
      </template>
      <template v-slot:item.operate="{item}">
        <v-tooltip right>
          <template v-slot:activator="{on, attr}">
            <v-icon
              color="primary"
              v-bind="attr"
              v-on="on"
              @click="directToProduct(item.src)"
            >mdi-eye</v-icon>
          </template>
          源链接
        </v-tooltip>
      </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" right top elevation="12" color="error">{{message}}</v-snackbar>
  </section>
</template>

<script>
import { keywordDetail, getStatics } from '@/api'
export default {
  data: () => ({
    loading: false,
    items: [],
    search: null,
    input_field: null,
    snackbar: false,
    message: null,
    headers: [
      {
        text: '缩略图',
        sortable: false,
        value: 'img'
      },
      {
        text: 'PID',
        sortable: false,
        value: '_id',
      },
      {
        text: '跟踪天数',
        value: 'days'
      },
      {
        text: '初始销量',
        value: 'start_sale',
      },
      {
        text: '最终销量',
        value: 'end_sale'
      },
      {
        text: '日均销量',
        value: 'avg_sale'
      },
      {
        text: '首次抓取日期',
        value: 'start_date'
      },
      {
        text: '最后抓取日期',
        value: 'end_date'
      },
      {
        text: '操作',
        value: 'operate',
        sortable: false
      }
    ],
    desserts: []
  }),
  methods: {
    async fetchData(key) {
      if (!key) {
        this.snackbar = true
        this.message = '请指定要查看的关键词'
        return
      }
      this.loading = true
      const res = await keywordDetail(key)
      res.forEach(item => {
        this.daysFormat(item)
        this.dailySaleFormat(item)
        this.dateFormat(item)
      });
      this.desserts = res
      this.loading = false
      this.snackbar = false
    },
    dateFormat(item) {
      item.start_date = this.$dayjs.unix(item.start_date).format('YYYY-MM-DD')
      item.end_date = this.$dayjs.unix(item.end_date).format('YYYY-MM-DD')
    },
    daysFormat(item) {
      let start = this.$dayjs.unix(item.start_date)
      let end = this.$dayjs.unix(item.end_date)
      item.days = this.$dayjs(start).from(end, true)
    },
    dailySaleFormat(item) {
      let total = item.end_sale - item.start_sale
      const reg = new RegExp(/\d+/)
      item.avg_sale = Math.round(total / parseInt(reg.exec(item.days)[0]))
    },
    directToProduct(src) {
      window.open(src)
    },
    async fetchStaticData() {
      const res = await getStatics()
      this.items = res.map(item => {
        item.value = item.name.replace('kw-', '').replace(/-/g, ' ')
        return item
      })
    },
    searchChange(val) {
      if (!val) return
      let item = this.items.find(item => item.name === val)
      if (item.value !== this.search)
        this.fetchData(this.input_field)
    }
  },
  created() {
    this.fetchStaticData()
    const key = this.$route.query.key ?? null
    if (key) {
      this.input_field = key
      this.fetchData(key)
    }
  }
}
</script>

<style>
</style>
