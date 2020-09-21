<template>
  <div class="table-log-p">
    <div v-for="i in 5" :key="i" class="table-log-p-tr">
      <div class="table-log-p-td">
        <div class="table-log-p-header">Chain</div>
        <div class="table-log-p-content">Tron</div>
      </div>
      <div class="table-log-p-td">
        <div class="table-log-p-header">Pair</div>
        <div class="table-log-p-content">TRX/BTT</div>
      </div>
      <div class="table-log-p-td">
        <div class="table-log-p-header">Exchange Rate</div>
        <div class="table-log-p-content">1 TRX = 302 BTT</div>
      </div>
      <div class="table-log-p-td">
        <div class="table-log-p-header">Pool Size</div>
        <div class="table-log-p-content">1 TRX = 302 BTT</div>
      </div>
      <div class="table-log-p-td">
        <div class="table-log-p-header">Pool Share</div>
        <div class="table-log-p-content">0.33/0.99 TRX (15%)</div>
      </div>
      <div class="table-log-p-td table-log-actions">
        <div class="table-log-p-header">Actions</div>
        <div class="table-log-p-content">
          <btn class="btn-success btn-block table-log-btn">Add Liquidity</btn>
          <btn class="btn-link btn-block table-log-btn-link"
            >Remove Liquidity</btn
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Btn from '~/components/Btn.vue'

export default Vue.extend({
  name: 'TableLog',
  components: {
    Btn,
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.table-log-p {
  width: 100%;
  font-size: 13px;
  margin-bottom: 24px;
  color: $table-log-color;
}
.table-log-p-td {
  display: flex;
  margin-bottom: 14px;
  justify-content: space-between;
}
.table-log-p-actions-md {
  display: none !important;
}
.table-log-p-header {
  display: block;
  font-weight: $card-header-font-weight;
}
.table-log-p-content {
  color: $table-log-content-color;
  text-align: right;
}
.table-log-p-tr {
  border: 1px solid;
  border-color: $table-log-border-color;
  border-radius: 8px;
  padding: 20px;
  + .table-log-p-tr {
    @include media-breakpoint-down(sm) {
      margin-top: 10px;
    }
  }
  .table-log-p-td:last-child {
    margin-bottom: 0;
  }
}
.table-log-p-actions {
  .btn {
    display: block;
    width: 100%;
  }
}
.table-log-p-actions {
  .table-log-p-header {
    display: none;
  }
  .table-log-p-content {
    width: 100%;
  }
}
.table-log-btn {
  .table-log-btn-link {
    margin-top: 14px;
  }
}
.table-log-btn-link {
  padding: 0;
  min-height: auto;
}
.table-log-actions {
  .table-log-p-header {
    opacity: 0;
    @include media-breakpoint-down(xs) {
      display: none;
    }
  }
  .table-log-p-content {
    @include media-breakpoint-down(xs) {
      width: 100%;
    }
  }
}
@include media-breakpoint-up(md) {
  .table-log-p {
    border: 1px solid;
    border-color: $table-log-border-color;
    border-radius: 8px;
    background-color: $table-log-background-color;
  }
  .table-log-p-td {
    padding: 20px 10px;
    width: 100%;
    margin: 0;
  }
  .table-log-p-tr {
    display: flex;
    margin: 0;
    border: none;
    border-radius: 0;
    padding: 0;
    .table-log-p-td {
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
        flex: 0 0 102px;
        max-width: 102px;
      }
      &:nth-child(2) {
        flex: 0 0 88px;
        max-width: 88px;
      }
      &:nth-child(3) {
        flex: 0 0 104px;
        max-width: 104px;
      }
      &:nth-child(4) {
        flex: 0 0 107px;
        max-width: 107px;
      }
      &:nth-child(5) {
        flex: 0 0 110px;
        max-width: 110px;
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
  .table-log-p-content {
    text-align: left;
    width: auto;
  }
  .table-log-p-btn {
    padding-left: 13px;
    padding-right: 13px;
  }
  .table-log-p-header {
    min-height: $line-height-base * 2em;
    margin-bottom: 9px;
  }
  .table-log-p-actions-md {
    margin-top: 8px;
  }
  .table-log-p-actions {
    .table-log-p-header {
      opacity: 0;
      margin-bottom: 4px;
      display: block;
    }
  }
  .table-log-btn {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
