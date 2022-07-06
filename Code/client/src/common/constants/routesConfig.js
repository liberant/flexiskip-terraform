const UserTypeEnum = {
  SUPERADMIN: 'SUPERADMIN',
  BUSINESSADMIN: 'BUSINESSADMIN',
  CUSTOMER: 'CUSTOMER',
  GUEST: 'GUEST',

  RESIDENTIAL_CUSTOMER: 'residentialCustomer',
  BUSINESS_CUSTOMER: 'businessCustomer',
  BUSINESS_ADMIN_CUSTOMER: 'businessAdminCustomer',
  CONTRACTOR: 'contractor',
  DRIVER: 'DRIVER',
};

Object.freeze(UserTypeEnum);

const UserRedirectPathEnum = {
  SUPERADMIN: '/admin/dashboard',
  BUSINESSADMIN: '/business/dashboard',
  CUSTOMER: '/customer/dashboard',
  contractor: '/contractor/dashboard',
  GUEST: '/contractor/login',
};

Object.freeze(UserRedirectPathEnum);

const UserLoginPathEnum = {
  SUPERADMIN: '/login',
  BUSINESSADMIN: '/contractor/login',
  CUSTOMER: '/contractor/login',
  contractor: '/contractor/login',
  GUEST: '/contractor/login',
};

Object.freeze(UserLoginPathEnum);

export {
  UserTypeEnum,
  UserRedirectPathEnum,
  UserLoginPathEnum,
};
