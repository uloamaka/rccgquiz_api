export interface authPayload {
    email: string;
    password: string;
    parish_name: string;
    personal_name: string;
    phone_number: string;
    user_image: String;
    residental_address: string;
    role?: 'Basic' | 'Admin';
    category?: 'YAYA' | 'Adults';
    class_name: string;
}

export interface otpPayload {
  email: string;
  entered_code: string;
}
export interface resetPayload {
  new_password: string;
  confirm_password: string;
}
