export enum HighLevelErrorCode {
  err_api_exception = 'err_api_exception',
  err_authentication_failed = 'err_authentication_failed',
  err_unauthorized = 'err_unauthorized',
  err_not_found = 'err_not_found',
  err_method_not_allowed = 'err_method_not_allowed'
}

/**
 * All field error codes. We use union of string literal types which are strongly typed
 * and at the same time their value is equal to error codes the API returns.
 * When you add a new error code here remember to also add the formatting message for
 * it in fieldErrorMsgs map below.
 */
export type FieldErrorCode =
  'required' |
  'invalid' |
  'null' |
  'blank' |
  'min_length' |
  'max_length' |
  'max_value' |
  'min_value' |
  'invalid_choice' |
  'empty' |
  'invalid_image' |
  'date' |
  'datetime' |
  'err_email_already_taken' |
  'err_incorrect_user_role' |
  'err_unique_stylist_phone' |
  'err_unique_client_phone' |
  'err_unique_client_name' |
  'err_invalid_query_for_home' |
  'err_appointment_in_the_past' |
  'err_appointment_intersection' |
  'err_appointment_outside_working_hours' |
  'err_appointment_non_working_day' |
  'err_service_does_not_exist' |
  'err_service_required' |
  'err_non_addon_service_required' |
  'err_client_does_not_exist' |
  'err_status_not_allowed' |
  'err_no_second_checkout' |
  'err_appointment_does_not_exist' |
  'err_stylist_is_already_in_preference' |
  'err_invalid_stylist_uuid' |
  'err_invalid_sms_code';

// Mapping of all field error codes to human readable messages
export const fieldErrorMsgs = new Map<FieldErrorCode, string>([
  ['required', '{0} is required.'],
  ['invalid', '{0} is invalid.'],
  ['null', '{0} cannot be blank.'],
  ['blank', '{0} cannot be blank.'],
  ['min_length', '{0} is too short.'],
  ['max_length', '{0} is too long.'],
  ['max_value', '{0} is too small.'],
  ['min_value', '{0} is too large.'],
  ['invalid_choice', '{0} is invalid.'],
  ['empty', '{0} cannot be empty.'],
  ['invalid_image', 'Image is invalid.'],
  ['date', '{0} date is in wrong format.'],
  ['datetime', '{0} date/time is in wrong format.'],
  ['err_email_already_taken', 'Email is already registered, try logging in.'],
  ['err_incorrect_user_role', 'No user role'],
  ['err_unique_stylist_phone', 'The phone number is registered to another stylist. Contact us if you have any questions.'],
  ['err_unique_client_phone', 'The phone number belongs to another client.'],
  ['err_unique_client_name', 'A client with the name already exists.'],
  ['err_invalid_query_for_home', 'Query should be one of \'upcoming\', \'past\' or \'today\'.'],
  ['err_appointment_in_the_past', 'Cannot add appointment for a past date and time.'],
  ['err_appointment_intersection', 'Cannot add appointment intersecting with another.'],
  ['err_appointment_outside_working_hours', 'Cannot add appointment outside working hours.'],
  ['err_appointment_non_working_day', 'Cannot add appointment on non-working day.'],
  ['err_service_does_not_exist', 'Stylist does not have such service.'],
  ['err_service_required', 'At least one service must be supplied when creating an appointment.'],
  ['err_non_addon_service_required', 'At least one non-addon service must be supplied when creating an appointment.'],
  ['err_client_does_not_exist', 'This client either does not exist or not related to the stylist.'],
  ['err_status_not_allowed', 'This status cannot be set for appointment.'],
  ['err_no_second_checkout', 'Appointment can only be checked out once.'],
  ['err_appointment_does_not_exist', 'The appointment either does not exists or does not belong to current stylist.'],
  ['err_stylist_is_already_in_preference', 'The stylist is already a preference.'],
  ['err_invalid_stylist_uuid', 'Invalid Stylist UUID'],
  ['err_invalid_sms_code', 'The code is incorrect.']
]);

/**
 * All non-field error codes. We use union of string literal types which are strongly typed
 * and at the same time their value is equal to error codes the API returns.
 * When you add a new error code here remember to also add the formatting message for
 * it in nonFieldErrorMsgs map below.
 */
export type NonFieldErrorCode =
  'err_signature_expired' |
  'err_invalid_access_token' |
  'err_auth_account_disabled' |
  'err_auth_unable_to_login_with_credentials' |
  'err_refresh_expired' |
  'err_orig_iat_is_required' |
  'err_wait_to_rerequest_new_code' |
  'err_available_time_not_set';

// Mapping of all non-field error codes to human readable messages
export const nonFieldErrorMsgs = new Map<NonFieldErrorCode, string>([
  ['err_signature_expired', 'Login expired, try logging in again.'],
  ['err_invalid_access_token', 'Internal error: JWT token is malformed.'],
  ['err_auth_account_disabled', 'This account is disabled.'],
  ['err_auth_unable_to_login_with_credentials', 'Invalid email or password.'],
  ['err_refresh_expired', 'Login expired, try logging in again.'],
  ['err_orig_iat_is_required', 'Internal error: malformed token.'],
  ['err_wait_to_rerequest_new_code', 'Minimum 2 minutes wait required to re-request new code.'],
  ['err_available_time_not_set', 'Day marked as available, but time is not set.']
]);

/**
 * A single error that is not related to a request field.
 */
export interface NonFieldErrorModel {
  code: NonFieldErrorCode;
}

/**
 * A single error related to a field in the request.
 */
export interface FieldErrorModel {
  code: FieldErrorCode;
}