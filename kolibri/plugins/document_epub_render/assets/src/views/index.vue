<template>

  <fullscreen
    ref="docViewer"
    class="doc-viewer"
    @changeFullscreen="isInFullscreen = $event"
  >

    <k-button
      class="btn doc-viewer-controls button-fullscreen"
      aria-controls="pdf-container"
      :text="isInFullscreen ? $tr('exitFullscreen') : $tr('enterFullscreen')"
      :primary="true"
      @click="$refs.docViewer.toggleFullscreen()"
    />

    <ui-icon-button
      class="doc-viewer-controls button-prev-page"
      aria-controls="pdf-container"
      size="large"
      @click="prevPage"
    >
      <mat-svg v-if="isRtl" name="chevron_right" category="navigation" />
      <mat-svg v-else name="chevron_left" category="navigation" />
    </ui-icon-button>
    <ui-icon-button
      class="doc-viewer-controls button-next-page"
      aria-controls="pdf-container"
      size="large"
      @click="nextPage"
    >
      <mat-svg v-if="isRtl" name="chevron_left" category="navigation" />
      <mat-svg v-else name="chevron_right" category="navigation" />
    </ui-icon-button>
    <div
      ref="epubContainer"
      class="epub-container"
    >
    </div>
  </fullscreen>

</template>


<script>

  import { mapGetters } from 'vuex';
  import Epub from 'epubjs/lib/epub';
  import manager from 'epubjs/lib/managers/default';
  import iFrameView from 'epubjs/lib/managers/views/iframe';
  import kButton from 'kolibri.coreVue.components.kButton';
  import uiIconButton from 'keen-ui/src/UiIconButton';
  import responsiveElement from 'kolibri.coreVue.mixins.responsiveElement';
  import responsiveWindow from 'kolibri.coreVue.mixins.responsiveWindow';
  import contentRendererMixin from 'kolibri.coreVue.mixins.contentRenderer';
  import throttle from 'lodash/throttle';
  import fullscreen from 'kolibri.coreVue.components.fullscreen';

  // How often should we respond to changes in scrolling to render new pages?
  const renderDebounceTime = 300;

  const scaleIncrement = 0.25;

  export default {
    name: 'epubRender',
    components: {
      kButton,
      uiIconButton,
      fullscreen,
    },
    mixins: [responsiveWindow, responsiveElement, contentRendererMixin],
    data: () => ({
      progress: 0,
      timeout: null,
      totalPages: null,
      isInFullscreen: false,
    }),
    computed: {
      ...mapGetters(['sessionTimeSpent']),
      epubURL() {
        return this.defaultFile.storage_url;
      },
      targetTime() {
        return this.totalPages * 30;
      },
      documentLoading() {
        return this.progress !== 1;
      },
    },
    watch: {
      scrollPos: 'checkPages',
      scale(newScale, oldScale) {
        // Listen to changes in scale, as we have to rerender every visible page if it changes.
        const noChange = newScale === oldScale;
        const firstChange = oldScale === null;

        if (!noChange && !firstChange && this.renderer) {
          this.renderer.resize(this.defaultWidth * newScale, this.defaultHeight * newScale);
        }
      },
    },
    created() {
      global.ePub = Epub;
      this.book = new Epub(this.epubURL);
    },
    mounted() {
      this.renderer = this.book.renderTo(this.$refs.epubContainer, {
        manager,
        view: iFrameView,
      });
      this.renderer.display();
    },
    beforeDestroy() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.updateProgress();
      this.$emit('stopTracking');
    },
    destroy() {
      delete global.ePub;
    },
    methods: {
      zoomIn: throttle(function() {
        this.scale += scaleIncrement;
      }, renderDebounceTime),
      zoomOut: throttle(function() {
        this.scale -= scaleIncrement;
      }, renderDebounceTime),
      nextPage() {
        this.renderer.next();
      },
      prevPage() {
        this.renderer.prev();
      },
      updateProgress() {
        this.$emit('updateProgress', this.sessionTimeSpent / this.targetTime);
      },
    },
    $trs: {
      exitFullscreen: 'Exit fullscreen',
      enterFullscreen: 'Enter fullscreen',
    },
  };

</script>


<style lang="scss" scoped>

  @import '~kolibri.styles.definitions';

  $keen-button-height: 48px;
  $fullscreen-button-height: 36px;
  $page-padding: 5px;

  .doc-viewer {
    position: relative;
    width: 90%;
    margin-right: auto;
    margin-left: auto;

    &-controls {
      position: absolute;
      z-index: 6; // material spec - snackbar and FAB
    }
  }

  .epub-container {
    height: 100%;

    // prevents a never-visible spot underneath the fullscreen button
    padding-top: $fullscreen-button-height + $page-padding;
    padding-bottom: $page-padding;
    background-color: #ffffff;
  }

  .button {
    &-fullscreen {
      top: $page-padding;
      left: 50%;
      transform: translateX(-50%);
    }

    &-prev-page {
      top: $page-padding;
      left: $keen-button-height / 2;
    }

    &-next-page {
      top: $page-padding;
      right: $keen-button-height / 2;
    }
  }

</style>
