import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Otp } from '../utils/interface';

const otpModel = sequelize.define<Otp>('otps', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    expiresIn: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
});

export default otpModel;
