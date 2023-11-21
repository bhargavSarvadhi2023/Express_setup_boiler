import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from '../utils/interface';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';

const userModel = sequelize.define<User>('users', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    firstname: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastname: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['admin', 'user'],
    },
});
userModel.afterValidate((data) => {
    if (data.changed('password')) {
        data.password = hashSync(data.password, genSaltSync(12));
    }
});
userModel.prototype.authenticate = function (val: string) {
    if (compareSync(val, this.password)) {
        return this;
    } else {
        return false;
    }
};

export default userModel;
