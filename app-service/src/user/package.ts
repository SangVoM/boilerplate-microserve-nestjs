export const USER_NAMESPACE = 'user';

export const MESSAGE_PATTERN = {
  CREATE: `${USER_NAMESPACE}.create`,
  FIND_BY_EMAIL: `${USER_NAMESPACE}.find-by-email`,
  FIND_BY_ID: `${USER_NAMESPACE}.find-by-id`,
};

export enum ACTION_TYPE {
  VERIFY_ACCOUNT = 'verify_account',
}
