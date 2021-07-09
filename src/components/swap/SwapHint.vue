<template>
  <div class="swap-hint">
    <div>Swap</div>
    <!-- <a :href="link" target="_blank">?</a> -->
  </div>
</template>

<script>
export default {
  name: "SwapHint",
  // data: function () {
  //   return {
  //     link: "https://medium.com/gravity-protocol/gravity-mainnet-alpha-launch-with-waves-bsc-as-target-chains-e110b59a01b8",
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.swap-hint {
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > :nth-child(1) {
    margin: auto 0;
  }
  & > :nth-child(2) {
    padding: 9px 14px;
    margin: 0 7px;
    background: rgb(196, 196, 196);
    border-radius: 30px;
    color: black;
  }
}
</style>
