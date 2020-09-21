<template>
  <div class="table-log-i">
    <div v-for="i in 5" :key="i" class="table-log-i-tr">
      <div class="table-log-i-td">
        <div class="table-log-i-header">Chain</div>
        <div class="table-log-i-content">Tron</div>
      </div>
      <div class="table-log-i-td">
        <div class="table-log-i-header">Send</div>
        <div class="table-log-i-content">1.2 TRX</div>
      </div>
      <div class="table-log-i-td">
        <div class="table-log-i-header">Receive</div>
        <div class="table-log-i-content">3.2 BTT</div>
      </div>
      <div class="table-log-i-td">
        <div class="table-log-i-header">Timestamp</div>
        <div class="table-log-i-content">
          22.07.2020<br />
          08:15:44
        </div>
      </div>
      <div class="table-log-i-td">
        <div class="table-log-i-header">Confirmation</div>
        <div class="table-log-i-content">
          10/30
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TableLogIntrachain',
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.table-log-i {
  width: 100%;
  font-size: 13px;
  margin-bottom: 24px;
  color: $table-log-color;
}
.table-log-i-td {
  display: flex;
  margin-bottom: 15px;
  justify-content: space-between;
}
.table-log-i-header {
  display: block;
  font-weight: $card-header-font-weight;
}
.table-log-i-content {
  color: $table-log-content-color;
  text-align: right;
}
.table-log-i-tr {
  border: 1px solid;
  border-color: $table-log-border-color;
  border-radius: 8px;
  padding: 20px;
  + .table-log-i-tr {
    margin-top: 10px;
  }
  .table-log-i-td:last-child {
    margin-bottom: 0;
  }
}
@include media-breakpoint-up(md) {
  .table-log-i {
    border: 1px solid;
    border-color: $table-log-border-color;
    border-radius: 8px;
    background-color: $table-log-background-color;
  }
  .table-log-i-td {
    padding: 20px 10px;
    width: 100%;
    margin: 0;
  }
  .table-log-i-tr {
    display: flex;
    margin: 0;
    border: none;
    border-radius: 0;
    padding: 0;
    .table-log-i-td {
      display: block;
      &:first-child {
        padding-left: 20px;
        @include media-breakpoint-only(md) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;
        @include media-breakpoint-only(md) {
          padding-left: 10px;
        }
      }
      &:nth-child(1) {
        flex: 0 0 118px;
        max-width: 118px;
      }
      &:nth-child(2) {
        flex: 0 0 124px;
        max-width: 124px;
      }
      &:nth-child(3) {
        flex: 0 0 132px;
        max-width: 132px;
      }
      &:nth-child(4) {
        flex: 0 0 156px;
        max-width: 156px;
      }
    }
    &:nth-child(even) {
      background-color: $table-log-even-background-color;
      border: 1px solid;
      border-color: $table-log-border-color;
      border-radius: 8px;
      margin-left: -1px;
      margin-right: -1px;
    }
  }
  .table-log-i-content {
    text-align: left;
    width: auto;
  }
  .table-log-i-btn {
    padding-left: 13px;
    padding-right: 13px;
  }
  .table-log-i-header {
    margin-bottom: 9px;
  }
}
</style>
