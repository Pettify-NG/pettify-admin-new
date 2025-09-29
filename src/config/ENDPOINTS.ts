const ENDPOINTS = {
  // Auth
  SIGN_IN: `auth/login`,
  SIGN_UP: `auth/register`,
  CONFIRM_EMAIL_OTP: `auth/confirm-email`,
  VERIFY_OTP: `auth/verify`,
  FORGOT_PASSWORD: `auth/forgot`,
  RESET_PASSWORD: `auth/reset`,
  RESEND_OTP: `auth/resend-otp`,

  // Upload Images
  UPLOAD_FILE: `upload`,

  // Slider Images
  SLIDER_IMAGES: `slider-images`,

  DELIVERY_PRICES: `delivery-prices`,

  // Users
  USERS: `users/users`, /** those who have never made a purchase **/ 
  ALL_USERS: `users`,  /** all users - if they've made a purchase or not **/
  MERCHANTS: `users/merchants`, /** all sellers - i.e all users with the role of "seller". **/
  CUSTOMERS: `users/customers`, /** all users who have made a purchase **/
  BUYERS: `users/buyers`, /** all users who register from the app - i.e. all those with the role of "buyers" */

  USER: `users/`,

  // Accessory
  ACCESSORY: `accessories/`,
  CREATE_ACCESSORY: `accessories/create`,

  // Orders
  ORDERS: `orders/`,
  UPDATE_ORDER_DELIVERY_STATUS: `orders`,

  // Pet
  PET: `pets/`,
  CREATE_PET: `pets/create`,

  // Wallet
  WALLET: `wallets/`,

  // Notifications
  NOTIFICATIONS: `notifications/`
};

export default ENDPOINTS;