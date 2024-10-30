// Table social_auth {
//   _id uid [PK]
//   user_id uuid [ref: > users._id]
//   provider varchar(255)
//   provider_user_id varchar(255)
//   access_token varchar(255)
//   refresh_token varchar(255)
//   expires_at varchar(255)
// }
import { model, Schema } from 'mongoose';

export interface IAuth {
    user_id: object
    provider: string;
    provider_user_id: string;
    access_token: string;
    refresh_token: string;
}
const userSchema = new Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        avatar_url: {
            type: String,
            default: '',
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['Basic', 'Admin'],
            default: 'Basic',
        },
        auth_type: {
            type: String,
            enum: ['form', 'google', 'github', 'x'],
            default: 'form',
        },
    },
    {
        required: true,
        timestamps: true,
    }
);
export const User = model<IAuth>('User', userSchema);
