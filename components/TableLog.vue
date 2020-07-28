<template>
  <div class="table-log">
    <div v-for="i in 5" :key="i" class="table-log-tr">
      <div class="table-log-td">
        <div class="table-log-header">Token</div>
        <div class="table-log-content">USDN</div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">FromChain</div>
        <div class="table-log-content">Waves</div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">ToChain</div>
        <div class="table-log-content">Ethereum</div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">Confirmation</div>
        <div class="table-log-content">10/30</div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">Status</div>
        <div class="table-log-content">
          Wait confirmation in ToChain
        </div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">ID</div>
        <div class="table-log-content text-primary">
          3P9...4x
          <icon
            v-clipboard="() => '3P94x'"
            class="table-log-copy"
            image="/img/icons/copy.svg"
          ></icon>
        </div>
        <div class="table-log-actions-md">
          <btn v-if="i === 1" class="btn-primary table-log-btn">Withdraw</btn>
        </div>
      </div>
      <div class="table-log-td">
        <div class="table-log-header">Timestamp</div>
        <div class="table-log-content">
          22.07.2020 08:15:44
        </div>
      </div>
      <div class="table-log-td table-log-actions">
        <div class="table-log-header">Actions</div>
        <div class="table-log-content">
          <btn v-if="i === 1" class="btn-primary table-log-btn">Withdraw</btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Btn from '~/components/Btn.vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  name: 'TableLog',
  components: {
    Icon,
    Btn,
  },
})
</script>

<style lang="scss">
@import '../assets/scss/import';

.table-log {
  width: 100%;
  font-size: 13px;
  margin-bottom: 24px;
}
.table-log-td {
  display: flex;
  margin-bottom: 15px;
  justify-content: space-between;
}
.table-log-actions-md {
  display: none !important;
}
.table-log-header {
  display: block;
  font-weight: 600;
}
.table-log-content {
  color: $secondary;
  text-align: right;
}
.table-log-tr {
  border: 1px solid #e4edef;
  border-radius: 8px;
  padding: 20px;
  + .table-log-tr {
    margin-top: 10px;
  }
  .table-log-td:last-child {
    margin-bottom: 0;
  }
}
.table-log-actions {
  .btn {
    display: block;
    width: 100%;
  }
}
.table-log-copy {
  margin-bottom: -0.3em;
  cursor: pointer;
  pointer-events: auto;
}
.table-log-actions {
  .table-log-header {
    display: none;
  }
  .table-log-content {
    width: 100%;
  }
}
@include media-breakpoint-up(md) {
  .table-log {
    border: 1px solid #e4edef;
    border-radius: 8px;
    background-color: white;
  }
  .table-log-td {
    padding: 20px 10px;
    width: 100%;
    margin: 0;
  }
  .table-log-tr {
    display: flex;
    margin: 0;
    border: none;
    border-radius: 0;
    padding: 0;
    .table-log-td {
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
        flex: 0 0 59px + 30px;
        max-width: 59px + 30px;
      }
      &:nth-child(2) {
        flex: 0 0 82px + 20px;
        max-width: 82px + 20px;
      }
      &:nth-child(3) {
        flex: 0 0 75px + 20px;
        max-width: 75px + 20px;
      }
      &:nth-child(4) {
        flex: 0 0 97px + 20px;
        max-width: 97px + 20px;
      }
      &:nth-child(5) {
        flex: 0 0 94px + 20px;
        max-width: 94px + 20px;
      }
      &:nth-child(6) {
        flex: 0 0 78px + 20px;
        max-width: 78px + 20px;
        @include media-breakpoint-only(md) {
          flex: 0 0 96px + 20px;
          max-width: 96px + 20px;
        }
      }
      &:nth-child(7) {
        flex: 0 0 80px + 20px;
        max-width: 80px + 20px;
      }
    }
    &:nth-child(even) {
      background: #f3f9f9;
      border: 1px solid #e4edef;
      border-radius: 8px;
      margin-left: -1px;
      margin-right: -1px;
    }
  }
  .table-log-content {
    text-align: left;
    width: auto;
  }
  .table-log-btn {
    padding-left: 13px;
    padding-right: 13px;
  }
  .table-log-header {
    margin-bottom: 9px;
  }
  .table-log-actions-md {
    margin-top: 8px;
  }
  .table-log-actions {
    .table-log-header {
      opacity: 0;
      margin-bottom: 4px;
      display: block;
    }
  }
}
@include media-breakpoint-only(md) {
  .table-log {
    max-width: 716px;
    margin-left: auto;
    margin-right: auto;
  }
  .table-log-td {
    padding: 20px 5px;
  }
  .table-log-actions-md {
    display: block !important;
  }
  .table-log-actions {
    display: none !important;
  }
  .table-log-tr {
    .table-log-td {
      &:first-child {
        padding-left: 10px;
      }
      &:last-child {
        padding-left: 10px;
      }
      &:nth-child(1) {
        flex: 0 0 61px + 15px;
        max-width: 61px + 15px;
      }
      &:nth-child(2) {
        flex: 0 0 86px + 10px;
        max-width: 86px + 10px;
      }
      &:nth-child(3) {
        flex: 0 0 79px + 10px;
        max-width: 79px + 10px;
      }
      &:nth-child(4) {
        flex: 0 0 101px + 10px;
        max-width: 101px + 10px;
      }
      &:nth-child(5) {
        flex: 0 0 97px + 10px;
        max-width: 97px + 10px;
      }
      &:nth-child(6) {
        flex: 0 0 107px + 10px;
        max-width: 107px + 10px;
      }
      &:nth-child(7) {
        flex: 0 0 80px + 10px;
        max-width: 80px + 10px;
      }
    }
  }
}
</style>
