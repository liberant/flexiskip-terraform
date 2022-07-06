import React from 'react';
import { Route } from 'react-router-dom';
import shortid from 'shortid';

import { makeLoadable } from './common/hocs';
import {
  superadminUserAuthenticated,
  // businessadminUserAuthenticated,
  customerUserAuthenticated,
  contractorUserAuthenticated,
  ProtectedRoute,
} from './common/containers/ProtectedRoute';
import AddVehiclePage from './contractor/manageVehicles/containers/AddVehiclePage';

// Async all pages.
// Admin
const AsyncNotFound = makeLoadable({ loader: () => import('./common/components/NotFoundPage') });
const AsyncAdminProfile = makeLoadable({ loader: () => import('./admin/profile/components/ProfilePage') });
const AsyncAdminResetPassword = makeLoadable({ loader: () => import('./admin/resetPassword/containers/ResetPasswordPage') });
const AsyncAdminForgotPassword = makeLoadable({ loader: () => import('./admin/resetPassword/containers/ForgotPasswordPage') });

const AsyncAdminManageProductsAdd = makeLoadable({ loader: () => import('./admin/manageProducts/containers/ProductsManageAddPage') });
const AsyncAdminManageProductsEdit = makeLoadable({ loader: () => import('./admin/manageProducts/containers/ProductsManageEditPage') });
const AsyncAdminManageCouncilProductsEdit = makeLoadable({ loader: () => import('./admin/manageProducts/containers/CouncilProductsManageEditPage') });
const AsyncAdminManageProducts = makeLoadable(
  { loader: () => import('./admin/manageProducts/containers/ProductsManagePage') },
  [
    AsyncAdminManageProductsEdit,
    AsyncAdminManageProductsAdd,
    AsyncAdminManageCouncilProductsEdit,
  ],
);

const AsyncAdminManageProductTypes = makeLoadable({ loader: () => import('./admin/manageProductTypes/containers/ProductTypesManagePage') });


const AsyncAdminCustomerResidentialPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/CustomerResidentialPage') });
const AsyncAdminCustomerBusinessPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/CustomerBusinessPage') });
const AsyncAdminBusinessContractorPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/BusinessContractorPage') });
const AsyncAdminDriverPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/DriverPage') });
const AsyncAdminHandelAdminPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/HandelAdminPage') });
const AsyncAdminCouncilOfficerPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/CouncilOfficerPage') });
const AsyncAdminAddUserPage = makeLoadable({ loader: () => import('./admin/manageAccounts/containers/AddUserPage') });
const AsyncAdminManageAccounts = makeLoadable(
  { loader: () => import('./admin/manageAccounts/containers/AccountsManagePage') },
  [
    AsyncAdminCustomerResidentialPage,
    AsyncAdminCustomerBusinessPage,
    AsyncAdminBusinessContractorPage,
    AsyncAdminDriverPage,
    AsyncAdminHandelAdminPage,
    AsyncAdminCouncilOfficerPage,
    AsyncAdminAddUserPage,
  ],
);


const AsyncAdminProductRequestsEdit = makeLoadable({ loader: () => import('./admin/productRequests/containers/ProductRequestsManageEditPage') });
const AsyncAdminProductRequests = makeLoadable(
  { loader: () => import('./admin/productRequests/containers/ProductRequestsManagePage') },
  [
    AsyncAdminProductRequestsEdit,
  ],
);

const AsyncAdminManageDiscountsAdd = makeLoadable({ loader: () => import('./admin/manageDiscountCodes/add/containers/DiscountAddPage') });
const AsyncAdminManageDiscountsEdit = makeLoadable({ loader: () => import('./admin/manageDiscountCodes/edit/containers/DiscountEditPage') });
const AsyncAdminManageDiscountsView = makeLoadable({ loader: () => import('./admin/manageDiscountCodes/view/containers/DiscountViewPage') });

const AsyncAdminManageDiscounts = makeLoadable(
  { loader: () => import('./admin/manageDiscountCodes/list/containers/DiscountListPage') },
  [
    AsyncAdminManageDiscountsEdit,
    AsyncAdminManageDiscountsAdd,
  ],
);


const AsyncAdminCollectionRequests = makeLoadable({ loader: () => import('./admin/collectionRequests/list/containers/CollectionRequestsManagePage') });
const AsyncAdminCollectionRequestsEdit = makeLoadable({
  loader: () => import('./admin/collectionRequests/edit/containers/CollectionRequestEditPage'),
});
const AsyncAdminCollectionRequestsView = makeLoadable({
  loader: () => import('./admin/collectionRequests/view/containers/CollectionRequestDetailPage'),
});

const AsyncAdminManageTransactions = makeLoadable(
  { loader: () => import('./admin/manageTransactions/containers/ManageTransactionsPage/ManageTransactionsPage') },
  [
    AsyncAdminProductRequestsEdit,
    AsyncAdminCollectionRequestsEdit,
  ],
);

const AsyncAdminDisputeView = makeLoadable({ loader: () => import('./admin/manageDisputes/view/containers/DisputeViewPage') });
const AsyncAdminDisputeEdit = makeLoadable({ loader: () => import('./admin/manageDisputes/edit/containers/DisputeEditPage') });
const AsyncAdminManageDisputes = makeLoadable(
  { loader: () => import('./admin/manageDisputes/list/containers/DisputeListPage') },
  [
    AsyncAdminDisputeView,
  ],
);


const CouncilAddPage = makeLoadable({ loader: () => import('./admin/manageCouncils/add/containers/CouncilAddPage') });
const CouncilViewPage = makeLoadable({ loader: () => import('./admin/manageCouncils/view/containers/CouncilViewPage') });
const CouncilEditPage = makeLoadable({ loader: () => import('./admin/manageCouncils/edit/containers/CouncilEditPage') });
const AddCouncilProductPage = makeLoadable({ loader: () => import('./admin/manageCouncils/add/containers/AddCouncilProductPage') });

const AsyncAdminManageCouncils = makeLoadable(
  { loader: () => import('./admin/manageCouncils/list/containers/CouncilListPage') },
  [
    CouncilEditPage,
    CouncilAddPage,
  ],
);

const AsyncAdminManageDumpsitesAdd = makeLoadable({ loader: () => import('./admin/manageDumpsites/add/containers/DumpsiteAddPage') });
const DumpsiteViewPage = makeLoadable({ loader: () => import('./admin/manageDumpsites/view/containers/DumpsiteViewPage') });
const DumpsiteEditPage = makeLoadable({ loader: () => import('./admin/manageDumpsites/edit/containers/DumpsiteEditPage') });

const AsyncAdminManageDumpsites = makeLoadable(
  { loader: () => import('./admin/manageDumpsites/list/containers/DumpsitesManagePage') },
  [
    DumpsiteViewPage,
    AsyncAdminManageDumpsitesAdd,
  ],
);

const AsyncAdminManageAdvertisingAdd = makeLoadable({ loader: () => import('./admin/manageAdvertising/containers/AdvertisingManageAddPage') });
const AsyncAdminManageAdvertisingEdit = makeLoadable({ loader: () => import('./admin/manageAdvertising/containers/AdvertisingManageEditPage') });
const AsyncAdminManageAdvertisingPreview = makeLoadable({ loader: () => import('./admin/manageAdvertising/containers/AdvertisingManagePreviewPage') });
const AsyncAdminManageAdvertisingPreviewUnsaved = makeLoadable({ loader: () => import('./admin/manageAdvertising/containers/AdvertisingManagePreviewPageUnsaved') });

const AsyncAdminManageAdvertising = makeLoadable(
  { loader: () => import('./admin/manageAdvertising/containers/AdvertisingManagePage') },
  [
    AsyncAdminManageAdvertisingEdit,
    AsyncAdminManageAdvertisingAdd,
    AsyncAdminManageAdvertisingPreview,
    AsyncAdminManageAdvertisingPreviewUnsaved,
  ],
);


const AsyncAdminDashboard = makeLoadable(
  { loader: () => import('./admin/dashboard/containers/Dashboard') },
  [
    AsyncAdminManageTransactions,
    AsyncAdminProductRequests,
    AsyncAdminManageProducts,
    AsyncAdminManageAccounts,
    AsyncAdminCollectionRequests,
    AsyncAdminManageDiscounts,
    AsyncAdminManageDisputes,
    AsyncAdminManageCouncils,
    AsyncAdminManageDumpsites,
    AsyncAdminManageAdvertising,
  ],
);

// const AsyncAdminComingSoon = makeLoadable({ loader: () =>
// import('./admin/comingsoon/containers/ComingSoon') });

const AsyncAdminComingSoon = makeLoadable(
  { loader: () => import('./admin/comingsoon/containers/ComingSoon') },
  [
    AsyncAdminManageTransactions,
    AsyncAdminProductRequests,
    AsyncAdminManageProducts,
    AsyncAdminManageAccounts,
    AsyncAdminCollectionRequests,
    AsyncAdminManageDiscounts,
    AsyncAdminManageDisputes,
    AsyncAdminManageCouncils,
    AsyncAdminManageDumpsites,
    AsyncAdminManageAdvertising,
  ],
);

const AsyncAdminLogin = makeLoadable(
  { loader: () => import('./admin/login/components/LoginPage') },
  [
    AsyncAdminDashboard,
  ],
);

const NonActivityListPage = makeLoadable({ loader: () => import('./admin/non-activity/containers/NonActivityListPage') });
const AsyncConnectedUserProfile = makeLoadable({
  loader: () => import('./admin/connectedUserProfile/containers/UserProfileDetailPage/UserProfileDetailPage'),
});

const AsyncAdminVehicle = makeLoadable({
  loader: () => import('./admin/vehicle/containers/VehicleDetailPage/VehicleDetailPage'),
});

// Contractor
const AsyncContractorRegister = makeLoadable({ loader: () => import('./contractor/register/containers/RegisterPage') });
const AsyncContractorResetPassword = makeLoadable({ loader: () => import('./contractor/resetPassword/containers/ResetPasswordPage') });
const AsyncContractorForgotPassword = makeLoadable({ loader: () => import('./contractor/resetPassword/containers/ForgotPasswordPage') });

const AsyncContractorDriverPage = makeLoadable({ loader: () => import('./contractor/manageAccounts/containers/DriverPage') });
const AsyncContractorAddDriverPage = makeLoadable({ loader: () => import('./contractor/manageAccounts/containers/AddDriverPage') });
const AsyncContractorManageDrivers = makeLoadable(
  { loader: () => import('./contractor/manageAccounts/containers/AccountsManagePage') },
  [
    AsyncContractorDriverPage,
    AsyncContractorAddDriverPage,
  ],
);

const AsyncContractorVehiclePage = makeLoadable({ loader: () => import('./contractor/manageVehicles/containers/VehiclePage') });
const AsyncContractorManagevehicles = makeLoadable(
  { loader: () => import('./contractor/manageVehicles/containers/VehiclesManagePage') },
  [
    AsyncContractorVehiclePage,
  ],
);

const AsyncContractorTransactionsEdit = makeLoadable({ loader: () => import('./contractor/manageTransactions/containers/ManageTransactionsEditPage') });
const AsyncContractorTransactions = makeLoadable(
  { loader: () => import('./contractor/manageTransactions/containers/ManageTransactionsPage') },
  [
    AsyncContractorTransactionsEdit,
  ],
);

const AsyncContractorProfilePage = makeLoadable({ loader: () => import('./contractor/manageProfile/containers/BusinessContractorPage') });
const AsyncContractorAddAdminPage = makeLoadable({ loader: () => import('./contractor/manageProfile/containers/AddAdminUserPage') });
const AsyncContractorEditAdminPage = makeLoadable({ loader: () => import('./contractor/manageProfile/containers/EditAdminUserPage') });

const AsyncContractorDashboard = makeLoadable(
  { loader: () => import('./contractor/dashboard/containers/Dashboard') },
  [
    AsyncContractorManageDrivers,
    AsyncContractorManagevehicles,
    AsyncContractorProfilePage,
    AsyncContractorTransactions,
    AsyncContractorAddAdminPage,
    AsyncContractorEditAdminPage,
    AsyncContractorAddDriverPage,
  ],
);


const AsyncContractorLogin = makeLoadable(
  { loader: () => import('./contractor/login/components/LoginPage') },
  [
    AsyncContractorDashboard,
  ],
);

// Council Officer
const AsyncCouncilOfficerResetPassword = makeLoadable({ loader: () => import('./admin/resetPassword/containers/ResetPasswordPage') });
const AsyncCouncilOfficerForgotPassword = makeLoadable({ loader: () => import('./admin/resetPassword/containers/ForgotPasswordPage') });

const AsyncEligibleDBDashboard = makeLoadable({ loader: () => import('./admin/manageEligibleDb/containers/EligibleDBManagePage') });
const AsyncReportDashboard = makeLoadable({ loader: () => import('./admin/reports/containers/ReportPage') });


// Runsheet
const AsyncRunsheetPage = makeLoadable({
    loader: () => import("./runsheet/containers/RunsheetPage"),
});

// Customer
const AsyncRatingCollectionRequest = makeLoadable({
  loader: () => import("./customer/ratingCollectionRequest"),
});

/**
 * Routes table.
 */

// common routes.
const commonRoutes = [
  <Route
    exact
    key={shortid.generate()}
    path="/login"
    component={AsyncAdminLogin}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/reset-password"
    component={AsyncAdminLogin}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/contractor/login"
    component={AsyncContractorLogin}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/contractor/register"
    component={AsyncContractorRegister}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/contractor/reset-password"
    component={AsyncContractorResetPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/contractor/set-password"
    component={AsyncContractorForgotPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/runsheet/:url"
    component={AsyncRunsheetPage}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/rating-collection-request/:id"
    component={AsyncRatingCollectionRequest}
  />
];

// super admin routes.
const superadminRoutes = [

  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/dashboard"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/profile"
    condition={superadminUserAuthenticated}
    component={AsyncAdminProfile}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/admin/reset-password"
    component={AsyncAdminResetPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/admin/forgot-password"
    component={AsyncAdminForgotPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/admin/set-password"
    component={AsyncAdminForgotPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/council-officer/reset-password"
    component={AsyncCouncilOfficerResetPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/council-officer/forgot-password"
    component={AsyncCouncilOfficerForgotPassword}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/council-officer/set-password"
    component={AsyncCouncilOfficerForgotPassword}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAccounts}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/res-customers/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCustomerResidentialPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/bus-customers/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCustomerBusinessPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/contractor/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminBusinessContractorPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/driver/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDriverPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/admin/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminHandelAdminPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/council-officer/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCouncilOfficerPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-accounts/add-user"
    condition={superadminUserAuthenticated}
    component={AsyncAdminAddUserPage}
  />,

  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-product-types"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageProductTypes}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-products"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageProducts}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-products-add"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageProductsAdd}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-products-edit/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageProductsEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-council-products-edit/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageCouncilProductsEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/product-requests"
    condition={superadminUserAuthenticated}
    component={AsyncAdminProductRequests}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/product-requests-edit/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminProductRequestsEdit}
  />,

  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/collection-requests"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCollectionRequests}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/collection-requests-view/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCollectionRequestsView}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/collection-requests-edit/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminCollectionRequestsEdit}
  />,

  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-discounts"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDiscounts}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/discounts/add"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDiscountsAdd}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/discounts/:id/view"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDiscountsView}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/discounts/:id/edit"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDiscountsEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-transactions"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageTransactions}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-disputes"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDisputes}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/disputes/:id/view"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDisputeView}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/disputes/:id/edit"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDisputeEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-councils"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageCouncils}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/councils/add"
    condition={superadminUserAuthenticated}
    component={CouncilAddPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/councils/:id/edit"
    condition={superadminUserAuthenticated}
    component={CouncilEditPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/councils/:id/view"
    condition={superadminUserAuthenticated}
    component={CouncilViewPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/councils/:id/new-council-product"
    condition={superadminUserAuthenticated}
    component={AddCouncilProductPage}
  />,

  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-dumpsites"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDumpsites}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/dumpsites/add"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageDumpsitesAdd}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/dumpsites/:id/view"
    condition={superadminUserAuthenticated}
    component={DumpsiteViewPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/dumpsites/:id/edit"
    condition={superadminUserAuthenticated}
    component={DumpsiteEditPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-advertising"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAdvertising}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-advertising-add"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAdvertisingAdd}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-advertising-edit/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAdvertisingEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-advertising-preview/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAdvertisingPreview}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/manage-advertising-preview-unsaved"
    condition={superadminUserAuthenticated}
    component={AsyncAdminManageAdvertisingPreviewUnsaved}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/admin/analytics"
    condition={superadminUserAuthenticated}
    component={AsyncAdminComingSoon}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/admin/settings"
    condition={superadminUserAuthenticated}
    component={AsyncAdminComingSoon}
  />,
  <Route
    exact
    key={shortid.generate()}
    path="/"
    condition={superadminUserAuthenticated}
    component={AsyncAdminDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/non-activity"
    condition={superadminUserAuthenticated}
    component={NonActivityListPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/connected-user-profile/:id"
    condition={superadminUserAuthenticated}
    component={AsyncConnectedUserProfile}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/vehicle/:id"
    condition={superadminUserAuthenticated}
    component={AsyncAdminVehicle}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/eligible-db"
    condition={superadminUserAuthenticated}
    component={AsyncEligibleDBDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/admin/reports"
    condition={superadminUserAuthenticated}
    component={AsyncReportDashboard}
  />,
];

// contractor admin routes.
const companyRoutes = [
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor"
    condition={contractorUserAuthenticated}
    component={AsyncContractorDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/dashboard"
    condition={contractorUserAuthenticated}
    component={AsyncContractorDashboard}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/drivers"
    condition={contractorUserAuthenticated}
    component={AsyncContractorManageDrivers}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/add-driver"
    condition={contractorUserAuthenticated}
    component={AsyncContractorAddDriverPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/drivers/:id"
    condition={contractorUserAuthenticated}
    component={AsyncContractorDriverPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/vehicles"
    condition={contractorUserAuthenticated}
    component={AsyncContractorManagevehicles}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/vehicles/add"
    condition={contractorUserAuthenticated}
    component={AddVehiclePage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/vehicles/:id"
    condition={contractorUserAuthenticated}
    component={AsyncContractorVehiclePage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/transactions"
    condition={contractorUserAuthenticated}
    component={AsyncContractorTransactions}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/transactions-edit/:id"
    condition={contractorUserAuthenticated}
    component={AsyncContractorTransactionsEdit}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/profile"
    condition={contractorUserAuthenticated}
    component={AsyncContractorProfilePage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/add-admin"
    condition={contractorUserAuthenticated}
    component={AsyncContractorAddAdminPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/contractor/edit-admin/:id"
    condition={contractorUserAuthenticated}
    component={AsyncContractorEditAdminPage}
  />,
  <ProtectedRoute
    exact
    key={shortid.generate()}
  />,
];

// common user routes.
// only for test.
const customerRoutes = [
  <ProtectedRoute
    exact
    key={shortid.generate()}
    path="/customer"
    condition={customerUserAuthenticated}
    component={AsyncNotFound}
  />,
];;

// default route.
const defaultRoute = [
    <Route key={shortid.generate()} component={AsyncNotFound} />,
];

const Routes = [
  ...commonRoutes,
  ...superadminRoutes,
  ...companyRoutes,
  ...customerRoutes,
  ...defaultRoute,
];

export default Routes;
