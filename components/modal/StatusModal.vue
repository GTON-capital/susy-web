<template>
  <modal name="status">
    <modal-content :show-footer="false">
      <template v-slot:head>
        <span class="text-secondary">Message </span>
      </template>
      <template v-slot:body>
        <radio-provider-group style="margin-bottom: 24px;">
          <div class="message-group">
            {{ message }}
          </div>
        </radio-provider-group>
        <div class="text-center">
          <btn
            class="btn-link btn-block"
            style="margin-top: 0;"
            @click="$emit('close')"
          >
            Back
          </btn>
        </div>
      </template>
    </modal-content>
  </modal>
</template>

<script>
import RadioProvider from '~/components/RadioProvider.vue'
import RadioAccount from '~/components/RadioAccount.vue'
import RadioProviderGroup from '~/components/RadioProviderGroup.vue'
import ModalContent from '~/components/ModalContent.vue'
import Btn from '~/components/Btn.vue'

export default {
  name: 'StatusModal',
  props: ['message'],
  components: {
    Btn,
    ModalContent,
    RadioProvider,
    RadioAccount,
    RadioProviderGroup,
  },
}
</script>

<style scoped></style>
