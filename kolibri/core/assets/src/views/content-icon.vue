<template>

  <span>
    <ui-icon ref="type-icon">
      <mat-svg
        v-if="is(ContentNodeKinds.CHANNEL)"
        category="navigation"
        name="apps"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.TOPIC)"
        category="file"
        name="folder"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.VIDEO)"
        category="notification"
        name="ondemand_video"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.AUDIO)"
        category="image"
        name="audiotrack"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.DOCUMENT)"
        category="action"
        name="book"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.EXERCISE)"
        category="action"
        name="assignment"
        :class="[colorClass, { 'rtl-icon': isRtl }]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.HTML5)"
        category="device"
        name="widgets"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.EXAM)"
        category="action"
        name="assignment_late"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.LESSON)"
        category="communication"
        name="import_contacts"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(USER)"
        category="social"
        name="person"
        :class="[colorClass]"
      />
      <mat-svg
        v-if="is(ContentNodeKinds.CLASSROOM)"
        category="communication"
        name="business"
        :class="[colorClass]"
      />
    </ui-icon>
    <ui-tooltip
      v-if="tooltipText && showTooltip"
      trigger="type-icon"
      position="top middle"
    >
      {{ tooltipText }}
    </ui-tooltip>
  </span>

</template>


<script>

  import { validateContentNodeKind } from 'kolibri.utils.validators';
  import { ContentNodeKinds, USER } from 'kolibri.coreVue.vuex.constants';
  import uiIcon from 'keen-ui/src/UiIcon';
  import uiTooltip from 'keen-ui/src/UiTooltip';

  export default {
    name: 'contentIcon',
    $trs: {
      topic: 'Topic',
      channel: 'Channel',
      exercise: 'Exercise',
      video: 'Video',
      audio: 'Audio',
      document: 'Document',
      html5: 'App',
      exam: 'Exam',
      lesson: 'Lesson',
      user: 'User',
    },
    components: {
      uiIcon,
      uiTooltip,
    },
    props: {
      kind: {
        type: String,
        required: true,
        validator(value) {
          return validateContentNodeKind(value, [USER]);
        },
      },
      colorstyle: {
        type: String,
        default: 'action',
      },
      showTooltip: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ContentNodeKinds() {
        return ContentNodeKinds;
      },
      USER() {
        return USER;
      },
      colorClass() {
        return `color-${this.colorStyle}`;
      },
      tooltipText() {
        const kindToLabeLMap = {
          [ContentNodeKinds.TOPIC]: 'topic',
          [ContentNodeKinds.CHANNEL]: 'channel',
          [ContentNodeKinds.EXERCISE]: 'exercise',
          [ContentNodeKinds.VIDEO]: 'video',
          [ContentNodeKinds.AUDIO]: 'audio',
          [ContentNodeKinds.DOCUMENT]: 'document',
          [ContentNodeKinds.HTML5]: 'html5',
          [ContentNodeKinds.EXAM]: 'exam',
          [ContentNodeKinds.LESSON]: 'lesson',
          [USER]: 'user',
        };
        const label = kindToLabeLMap[this.kind];
        return label ? this.$tr(label) : '';
      },
    },
    methods: {
      is(kind) {
        return this.kind === kind;
      },
    },
  };

</script>


<style lang="scss" scoped>

  .ui-icon {
    font-size: 1em;
  }

</style>
