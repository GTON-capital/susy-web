<template>
  <modal name="logs">
    <modal-content :show-footer="false" size="lg">
      <!-- <template v-slot:head>
        Logs
      </template> -->
      <template v-slot:body>
        <table-log></table-log>
        <pagination v-model="page" count-pages="10"></pagination>
      </template>
    </modal-content>
  </modal>
</template>

<script>
// import RadioProvider from '~/components/RadioProvider.vue'
// import RadioAccount from '~/components/RadioAccount.vue'
// import RadioProviderGroup from '~/components/RadioProviderGroup.vue'
import ModalContent from '~/components/ModalContent.vue'
import Btn from '~/components/Btn.vue'
import TableLog from '~/components/TableLog.vue'
import Pagination from '~/components/Pagination.vue'


export default {
    name: 'ActionLogsModal',
    props: ['page'],
    components: {
        Pagination,
        ModalContent,
        TableLog,
    }
}
</script>