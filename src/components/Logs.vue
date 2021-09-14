<template>
  <div class="table-container">
    <Table ref="table" class="">
      <template v-slot:head>
        <tr class="container-table">
          <th class="table-title" :class="{ center: item.id == 4 || item.id == 5 }" v-for="item in tableTitles" :key="item.id">
            <span class="title" v-html="item.title"></span>
          </th>
        </tr>
      </template>
      <template v-slot:body>
        <div class="table-item" v-for="item in pagingPage" :key="item.id">
          <tr class="container-table">
            <td class="table-item">
              {{ item.token }}
            </td>
            <td class="table-item">
              {{ item.origin }}
            </td>
            <td class="table-item">
              {{ item.destination }}
            </td>
            <td class="table-item">
              {{ item.status }}
            </td>
            <td class="table-item center">${{ item.value }}</td>
            <td class="table-item center">${{ item.amount }}</td>
            <td class="table-item purple">
              {{ item.lockingTrx }}
              <CopyClipboard class="copy" />
            </td>
            <td class="table-item purple">
              {{ item.mintingTrx }}
              <CopyClipboard class="copy" />
            </td>
            <td class="table-item">
              <span>{{ item.date }}</span>
              <span>{{ item.time }}</span>
            </td>
          </tr>
        </div>
        <div class="pagination">
          <button class="button-pagination" :class="{ 'opacity-item': currentPage == 1 }" @click="prevPage()">
            <img class="pagination-img rotate" src="/img/icons/chevron-pagination.svg" />
          </button>

          <span class="pagination-elem">{{ currentPage }}</span>
          <span>of</span>
          <span class="count-item"> {{ pageAmount }}</span>
          <button class="button-pagination" :class="{ 'opacity-item': currentPage == pageAmount + 1 }" @click="nextPage()">
            <img class="pagination-img" src="/img/icons/chevron-pagination.svg" />
          </button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Table from "~/components/Table.vue"

export const tableTitles = [
  {
    id: 0,
    title: "Token",
  },
  {
    id: 1,
    title: "From <br/>Chain",
  },
  {
    id: 2,
    title: "To <br/>Chain",
  },
  {
    id: 3,
    title: "Status",
  },
  {
    id: 4,
    title: "Value $",
  },
  {
    id: 5,
    title: "Amount",
  },
  {
    id: 6,
    title: "locking trx <br /> address",
  },
  {
    id: 7,
    title: "Minting trx <br /> address",
  },
  {
    id: 8,
    title: "Timestamp",
  },
]

export const tableList = [
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "In progress",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "In progress",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "In progress",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "In progress",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "Completed",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
  {
    token: "USDN",
    origin: "Waves",
    destination: "Ethereum",
    status: "In progress",
    value: 10,
    amount: 10,
    lockingTrx: "3P9...4x",
    mintingTrx: "3P9...4x",
    date: "22.07.2020",
    time: "08:15:44",
  },
]

export default Vue.extend({
  name: "Logs",
  data() {
    return {
      tableTitles,
      tableList,
      itemsPerPage: 8,
      currentPage: 1,
    }
  },
  components: {
    Table,
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageAmount) {
        this.currentPage += 1;
      }
    },
  },
  computed: {
    pageAmount() {
      let pages = Math.ceil(this.tableList.length / this.itemsPerPage)
      console.log(this.tableList.length)
      if (pages === 0) return 1
      return pages
    },
    pagingPage(): any {
      let start;
      if (this.currentPage == 1) {
        start = 0;
      } else {
        start = (this.currentPage - 1) * this.itemsPerPage;
      }
      return this.tableList.slice(start, start + this.itemsPerPage);
    },
  },
})
</script>

<style lang="scss">
.table-container {
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  background: #ffffff;
  border: 1px solid #eaf1f3;
  box-sizing: border-box;
  box-shadow: 0px 1px 25px #e2f1f6;
  border-radius: 18px;
  @media (max-width: 1200px) {
    width: 90%;
  }
  @media (max-width: 920px) {
    overflow: auto;
  }
}
.table-item {
  border-bottom: 1px solid #eaf1f3;
}
.container-table {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
}
.table-title {
  font-size: 13px;
  font-weight: 600;
  color: #001a34;
}
.table-item {
  color: #73979c;
  font-size: 13px;
  font-weight: 400;
}
.center {
  text-align: center;
}
.purple {
  color: #ff0097;
}
.rotate {
  transform: rotate(180deg);
}

.pagination {
  text-align: center;
  margin: 27px auto 20px auto;
}
.button-pagination {
  border: none;
  background: none;
  cursor: pointer;
  &:focus{
    outline: none;
  }
}
.opacity-item{
  opacity: 0.5;
}
</style>
