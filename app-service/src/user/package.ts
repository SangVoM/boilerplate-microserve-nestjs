export const USER_NAMESPACE = 'user';

export const MESSAGE_PATTERN = {
  CREATE: `${USER_NAMESPACE}.create`,
  FIND_BY_EMAIL: `${USER_NAMESPACE}.find-by-email`,
};

export enum ACTION_TYPE {
  VERIFY_ACCOUNT = 'verify_account',
}
