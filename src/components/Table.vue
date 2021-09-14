<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <slot name="head"></slot>
      </thead>
      <tbody ref="tbody">
        <slot name="body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  name: "Table",
})
</script>

<style lang="scss">
.table-wrap{
  @media (max-width: 920px) {
    width: 1000px;
  }
}
.table {
  display: flex;
  flex-flow: column;
  width: 100%;
  z-index: 999;

  th,
  td {
    vertical-align: top;
    border: none;
  }

  thead tr:nth-child(1) th {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 30px 0px 20px 0px;
    vertical-align: middle;
  }
  thead {
    flex: 0 0 auto;
    background: #f3f9f9;
    border-bottom: 1px solid #e4edef;
    border-radius: 17px 17px 0px 0px !important;
  }
  tbody {
    td,
    th {
      vertical-align: middle;
      padding: 15px 0px;
    }
    tr {
      &:first-child {
        td,
        th {
          border-top: 0;
        }
      }
    }
  }

  tr {
    width: 100%;
    display: table;
    table-layout: fixed;
    @media (max-width: 1200px) {
      width: 90%;
    }
  }
}
</style>
