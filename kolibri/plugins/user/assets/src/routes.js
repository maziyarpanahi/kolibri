import store from 'kolibri.coreVue.vuex.store';
import router from 'kolibri.coreVue.router';
import { showSignInPage, showSignUpPage, showProfilePage } from './state/actions';
import { PageNames } from './constants';

export default [
  {
    name: PageNames.ROOT,
    path: '/',
    handler: () => {
      if (store.getters.isUserLoggedIn) {
        router.getInstance().replace({
          name: PageNames.PROFILE,
        });
      } else {
        router.getInstance().replace({
          name: PageNames.SIGN_IN,
        });
      }
    },
  },
  {
    name: PageNames.SIGN_IN,
    path: '/signin',
    handler: () => {
      if (store.getters.isUserLoggedIn) {
        router.getInstance().replace({
          name: PageNames.PROFILE,
        });
      } else {
        showSignInPage(store);
      }
    },
  },
  {
    name: PageNames.SIGN_UP,
    path: '/create_account',
    handler: () => {
      if (store.getters.isUserLoggedIn) {
        router.getInstance().replace({
          name: PageNames.PROFILE,
        });
        return Promise.resolve();
      } else {
        return showSignUpPage(store);
      }
    },
  },
  {
    name: PageNames.PROFILE,
    path: '/profile',
    handler: () => {
      if (!store.getters.isUserLoggedIn) {
        router.getInstance().replace({
          name: PageNames.SIGN_IN,
        });
      } else {
        showProfilePage(store);
      }
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];
