<template>

  <div class="snackbar">
    <div class="table">
      <div class="row">
        <div class="icon-container cell">
          <slot name="icon"></slot>
        </div>
        <div class="content-container cell">
          <slot name="content"></slot>
        </div>
        <div class="close-container cell">
          <ui-icon-button
            size="small"
            :ariaLabel="$tr('close')"
            @click="$emit('close')"
          >
            <mat-svg name="close" category="navigation" />
          </ui-icon-button>
        </div>
      </div>
    </div>
    <slot name="alert"></slot>
  </div>

</template>


<script>

  import UiIconButton from 'keen-ui/src/UiIconButton';

  export default {
    name: 'snackbar',
    $trs: {
      close: 'Close',
    },
    components: {
      UiIconButton,
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri.styles.definitions';

  .snackbar {
    position: fixed;
    right: 8px;
    bottom: 8px;
    z-index: 24;
    width: 304px;
    padding: 8px;
    font-size: 14px;
    background-color: $core-bg-canvas;
    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12);
    animation-duration: 0.3s;
    animation-timing-function: ease;
    animation-fill-mode: both;
  }

  .table {
    display: table;
  }

  .row {
    display: table-row;
  }

  .cell {
    display: table-cell;
    vertical-align: middle;
  }

  .content-container {
    width: 99%;
    padding: 0 16px;
  }

</style>
