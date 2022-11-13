export const USER_NAMESPACE = 'user';

export const METHODS = {
  FIND_BY_ID: 'find_by_id',
  REGISTER: 'register',
};
export const MESSAGE_PATTERN = {
  FIND_BY_EMAIL: `${USER_NAMESPACE}.find-by-email`,
  FIND_BY_ID: `${USER_NAMESPACE}.find-by-id`,
  CREATE: `${USER_NAMESPACE}.create`,
};
