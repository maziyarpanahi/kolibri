import Vue from 'vue';
import { SessionResource, AttemptLogResource } from 'kolibri.resources';
import * as constants from '../../src/constants';
import * as browser from '../../src/utils/browser';
import ConditionalPromise from '../../src/conditionalPromise';
import { coreStoreFactory as makeStore } from '../../src/state/store';

describe('Vuex store/actions for core module', () => {
  describe('error handling', () => {
    const errorMessage = 'testError';
    Vue.prototype.$formatMessage = () => errorMessage;
    it('handleError action updates core state', () => {
      const store = makeStore();
      store.dispatch('handleError', 'catastrophic failure');
      expect(store.state.core.error).toEqual('catastrophic failure');
      expect(store.state.core.loading).toBeFalsy();
    });

    it('handleApiError action updates core state', () => {
      const store = makeStore();
      const apiError = { message: 'Too Bad' };
      store.dispatch('handleApiError', apiError);
      expect(store.state.core.error.match(/Too Bad/)).toHaveLength(1);
      expect(store.state.core.loading).toBeFalsy();
    });
  });

  describe('kolibriLogin', () => {
    let store;
    let assignStub;

    beforeEach(() => {
      store = makeStore();
      assignStub = jest.spyOn(browser, 'redirectBrowser');
    });

    afterEach(() => {
      assignStub.mockRestore();
    });

    it('successful login', async () => {
      Object.assign(SessionResource, {
        createModel: () => ({
          save: () =>
            Promise.resolve({
              // just sending subset of sessionPayload
              id: '123',
              username: 'e_fermi',
              kind: ['cool-guy-user'],
            }),
        }),
      });

      await store.dispatch('kolibriLogin', {});
      const { session } = store.state.core;
      expect(session.id).toEqual('123');
      expect(session.username).toEqual('e_fermi');
      expect(session.kind).toEqual(['cool-guy-user']);
      expect(assignStub).toHaveBeenCalled();
    });

    it('failed login (401)', async () => {
      Object.assign(SessionResource, {
        createModel: () => ({
          save: () => Promise.reject({ status: { code: 401 } }),
        }),
      });

      await store.dispatch('kolibriLogin', {});
      expect(store.state.core.loginError).toEqual(constants.LoginErrors.INVALID_CREDENTIALS);
    });
  });
});

describe('Vuex core logging actions', () => {
  describe('attempt log saving', () => {
    it('saveAndStoreAttemptLog does not overwrite state if item id has changed', async () => {
      const store = makeStore();
      store.dispatch('createAttemptLog', 'first');
      let externalResolve;
      const firstState = Object.assign({}, store.state.core.logging.attempt);
      const findModelStub = jest.spyOn(AttemptLogResource, 'findModel');
      findModelStub.mockReturnValue({
        save: () =>
          new ConditionalPromise(resolve => {
            externalResolve = resolve;
          }),
      });
      const promise = store.dispatch('saveAndStoreAttemptLog');
      store.dispatch('createAttemptLog', 'second');
      store.state.core.logging.attempt.id = 'assertion';
      externalResolve(firstState);
      await promise;
      expect(store.state.core.logging.attempt.id).toEqual('assertion');
      expect(store.state.core.logging.attempt.item).toEqual('second');
    });
  });
});
