/**
 * Pattern phone
 * Only check startWith 04, 02, 03, 07, 08
 */
const AU_PHONE_PATTERN = /^(([0-9]{1,9})|([0-9]{11,})|(02|03|04|07|08)([0-9]{8}))$/;
const STRIPE_PAYMENT_METHOD_TRIGGERS = {
  GCC_VIOLATION_CHARGE: "gcc-violation-charge"
};

module.exports = {
  AU_PHONE_PATTERN,
  STRIPE_PAYMENT_METHOD_TRIGGERS
};
