import {USER_NAMESPACE} from "../api/user/package";

export const AUTH_NAMESPACE = 'auth';

export const METHODS = {
  LOGIN: 'login',
  REGISTER: 'register',
};
export const MESSAGE_PATTERN = {
  REGISTER: `${AUTH_NAMESPACE}.register`,
  CREATE: `${USER_NAMESPACE}.create`,
};

export enum ACTION_TYPE {
  VERIFY_ACCOUNT = 'verify_account',
}
