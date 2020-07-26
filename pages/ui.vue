<template>
  <div>
    <btn tag="a" to="/">Next</btn>
    <btn tag="a" to="/" class="btn-primary">Next</btn>
    <btn tag="a" to="/" class="btn-secondary">Next</btn>
    <btn tag="a" to="/" class="btn-secondary btn-block">Next</btn>
    <btn tag="a" to="/" class="btn-secondary btn-block">
      <icon image="/img/icons/metamask.svg"></icon>
      Next
    </btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Btn from '~/components/Btn.vue'
import Icon from '~/components/Icon.vue'

export default Vue.extend({
  components: { Btn, Icon },
})
</script>

<style></style>
