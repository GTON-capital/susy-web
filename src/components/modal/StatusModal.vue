<template>
  <modal name="status">
    <modal-content :show-footer="false">
      <template v-slot:head>
        <span class="text-secondary">Message </span>
      </template>
      <template v-slot:body>
        <radio-provider-group style="margin-bottom: 24px">
          <div class="message-group">
            qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq
            {{ message.text }}
          </div>
          <div class="message-group-links" v-if="links.length > 0">
            <a
              target="_blank"
              :href="link.value"
              :key="link.title"
              v-for="link in links"
              >{{ link.title }}</a
            >
          </div>
        </radio-provider-group>
        <div class="text-center">
          <btn
            class="btn-link btn-block"
            style="margin-top: 0"
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
  props: ['message', 'sourceChain', 'destinationChain'],
  computed: {
    links: function () {
      return [this.message.linkA, this.message.linkB]
        .filter(Boolean)
        .map((link, index) => {
          return {
            title:
              index === 0
                ? this.sourceChain.label
                : this.destinationChain.label,
            value: link,
          }
        })
    },
  },
  components: {
    Btn,
    ModalContent,
    RadioProvider,
    RadioAccount,
    RadioProviderGroup,
  },
  mounted() {
    this.$modal.push('status')
  },
}
</script>

<style scoped>
.message-group-links {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  line-height: 1.7;
}
.message-group {
  width: 460px;
  overflow-wrap: break-word;
}
</style>
