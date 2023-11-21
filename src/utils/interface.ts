import { Model } from 'sequelize';

interface User extends Model {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: 'admin' | 'user';
    authenticate(password: string): boolean | string;
}
interface Otp extends Model {
    id: string;
    otp: number;
    expiresIn: number;
    userId: string;
}

export { User, Otp };
