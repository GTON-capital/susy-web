<template>
  <div>1</div>
</template>

<script>
  export default {
    middleware({ store, redirect }) {
      return redirect('https://explorer.gravity.tech/nodes')
    }
  }
</script>
