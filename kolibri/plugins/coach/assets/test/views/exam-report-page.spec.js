import { mount } from '@vue/test-utils';
import ExamReportPage from '../../src/views/exams/exam-report-page';
import makeStore from '../makeStore';

function makeWrapper(options = {}) {
  const store = makeStore();
  store.state.classId = 'class_1';
  store.state.pageState = {
    channelId: 'channel_1',
    examTakers: [],
    exam: {
      title: 'exam',
      question_count: 6,
    },
    learnerGroups: [],
  };
  if (options.examTakers) {
    store.state.pageState.examTakers = options.examTakers;
  }
  return mount(ExamReportPage, { ...options, store, stubs: ['kRouterLink', 'assignmentSummary'] });
}

function getElements(wrapper) {
  return {
    averageScoreText: () => wrapper.find('.average-score').text(),
    tableRows: () => wrapper.findAll('tbody > tr'),
  };
}

// prettier-ignore
function getTextInScoreColumn(tdEl) {
  // in the fourth column
  return tdEl.findAll('td').at(3).text();
}

describe('exam report page', () => {
  it('average score is not shown if no exams are in progress', () => {
    const examTakers = [
      { progress: undefined, group: {}, score: undefined },
      { progress: undefined, group: {}, score: undefined },
    ];

    const wrapper = makeWrapper({ examTakers });
    const { averageScoreText } = getElements(wrapper);
    expect(averageScoreText().endsWith('%')).toEqual(false);
  });

  it('average score is shown if at least one exam in progress', () => {
    const examTakers = [
      { progress: 6, group: {}, score: 3 },
      { progress: 6, group: {}, score: 3 },
      { progress: undefined, group: {}, score: undefined },
    ];
    const wrapper = makeWrapper({ examTakers });
    const { averageScoreText } = getElements(wrapper);
    expect(averageScoreText().endsWith('%')).toEqual(true);
  });

  it('shows correct scores for exam takers', () => {
    const examTakers = [
      { progress: 6, group: {}, score: 3 },
      { progress: undefined, group: {}, score: undefined },
    ];
    const wrapper = makeWrapper({ examTakers });
    const { tableRows } = getElements(wrapper);
    // score is properly formatted
    expect(getTextInScoreColumn(tableRows().at(0)).trim()).toEqual('50%');
    // emdash
    expect(getTextInScoreColumn(tableRows().at(1)).trim()).toEqual('–');
  });
});
