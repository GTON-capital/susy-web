<template>
  <div class="wrap-bug сontainer">
    <div class="info">
      WARNING: The current version of Gravity swap has not yet undergone a
      security audit. We kindly call on our community to become involved in
      testing of the alpha version using the smallest possible swap amounts.
      <br />
      <br class="mobil" />
      For the most critical vulnerabilities found, you may be rewarded: please
      submit your findings using
      <a
        class="form"
        target="_blank"
        href="https://forms.gle/QwfToeoi8jE3YTaNA"
      >
        this form
      </a>
    </div>
    <hr class="bottom-line" />
  </div>
</template>

<script>
export default {
  name: 'BugBounty',
}
</script>

<style scoped lang="scss">
.wrap-bug {
  background: -webkit-linear-gradient(
    270deg,
    rgba(46, 51, 86, 1),
    rgba(16, 17, 26, 1) 80%
  );
  .mobil {
    display: block;
  }
  @include media-breakpoint-up(md) {
    .mobil {
      display: none;
    }
    box-sizing: border-box;
    width: auto;
    background: -webkit-linear-gradient(
      270deg,
      rgba(46, 51, 86, 1),
      rgba(16, 17, 26, 1) 80%
    );
  }
}
.info {
  margin: 20px;
  @include media-breakpoint-up(md) {
    margin-bottom: 20px;
    font-size: 11px;
    line-height: 16px;
    text-align: center;
    margin: 12px 80px;
    color: rgba(201, 199, 199, 100);
  }
}

.form {
  color: #44D7B6;
}
.line {
  background: -webkit-linear-gradient(0deg, #6000FF, #4200C0, #FF5E00);
}
.bottom-line {
  background: -webkit-linear-gradient(270deg, #6000FF, #FF5E00);
  height: 1px;
}
</style>

