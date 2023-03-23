import { BaseStore } from '$lib/store/base';
import { saveToLocalStorage, getFromLocalStorage, delay } from '$lib/utils/functions';
import type { UserStore as UserStoreType, LoginResponseDto, UserDto } from '$lib/types';
import { Role } from '$lib/enums';
import { browser } from '$app/environment';
import axios from '$lib/axios';
import Axios from 'axios';

export class UserStore extends BaseStore<UserStoreType> {
  static storeDefault = {
    accessToken: '',
    refreshToken: '',
    user: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      role: Role.VOLUNTEER,
      avatar: null,
      lastAccess: null,
      fieldId: '',
      field: null,
    },
    isUserLogged: false,
    tokenValidated: Date.now(),
    isReady: false
  };

  private MIN_VALIDATION_TIME = 10 * 60 * 1000; // 10min - ms

  constructor() {
    super(UserStore.storeDefault);
    this.init();
  }

  async init() {
    const user = getFromLocalStorage('user');
    const accessToken = getFromLocalStorage('accessToken');
    const refreshToken = getFromLocalStorage('refreshToken');
    const tokenValidated = getFromLocalStorage('tokenValidated');

    if (user && accessToken && refreshToken && tokenValidated) {
      this.updateUser(user);
      this.updateTokens(accessToken, refreshToken, tokenValidated)
    }

    this.store.update(data => ({
      ...data,
      isReady: true
    }));
  }

  updateTokens(accessToken: string, refreshToken: string, tokenValidated: number | null = null) {
    this.store.update(data => ({
      ...data,
      isUserLogged: true,
      accessToken,
      refreshToken,
      tokenValidated: tokenValidated ? tokenValidated : Date.now()
    }));
    saveToLocalStorage('accessToken', accessToken);
    saveToLocalStorage('refreshToken', refreshToken);
    saveToLocalStorage('tokenValidated', tokenValidated ? tokenValidated : Date.now());
  }

  updateUser(userData: UserDto) {
    this.store.update(data => ({
      ...data,
      user: {
        ...data.user,
        ...userData
      }
    }));
    saveToLocalStorage('user', userData);
  }

  updateStore(loginResponse: LoginResponseDto) {
    this.store.update(() => ({
      ...loginResponse,
      isUserLogged: true,
      tokenValidated: Date.now(),
      isReady: true
    }));

    const { user, accessToken, refreshToken } = loginResponse;
    saveToLocalStorage('accessToken', accessToken)
    saveToLocalStorage('refreshToken', refreshToken)
    saveToLocalStorage('user', user)
    saveToLocalStorage('tokenValidated', Date.now());
    axios.setAuth(accessToken);
  }

  eraseStore() {
    this.store.set(UserStore.storeDefault);
    saveToLocalStorage('accessToken', null)
    saveToLocalStorage('refreshToken', null)
    saveToLocalStorage('user', null)
    saveToLocalStorage('tokenValidated', null);
    axios.setAuth(null);
  }

  async isTokenValid() {
    const lastTimeValidated = this.get('tokenValidated');
    if (lastTimeValidated + this.MIN_VALIDATION_TIME >= Date.now()) {
      return
    }

    return await this.getTokens();
  }

  isAdmin() {
    return (this.get()).user.role === Role.ADMIN;
  }

  isWebMaster() {
    return (this.get()).user.role === Role.WEB_MASTER;
  }

  private async getTokens() {
    const refreshToken: string = this.get('refreshToken');
    if (!refreshToken) {
      this.eraseStore();
      return false;
    }

    try {
      const res = await axios
        .post('/auth/refresh', {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });

      if (!res) {
        this.eraseStore();
        return false;
      }

      const { accessToken: at, refreshToken: rt } = res.data.data;
      this.updateTokens(at, rt);
      axios.setAuth(at);

      return true;
    } catch (error) {
      if (error instanceof Axios.AxiosError) {
        const message = error.response?.data.message;
        this.eraseStore();
      }
      console.warn(error)
      return false;
    }
  }
}