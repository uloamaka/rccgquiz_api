export interface authPayload {
  username: string;
  email: string;
  password: string;
}

export interface otpPayload {
  email: string;
  entered_code: string;
}
export interface resetPayload {
  new_password: string;
  confirm_password: string;
}
