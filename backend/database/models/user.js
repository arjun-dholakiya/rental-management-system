module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING, // admin | vendor | customer
    companyName: DataTypes.STRING,
    gstin: DataTypes.STRING
  });

  User.associate = (models) => {
    // Vendor → Products
    User.hasMany(models.Product, {
      foreignKey: 'ownerVendorId',
      as: 'products'
    });

    // Customer → Quotations
    User.hasMany(models.Quotation, {
      foreignKey: 'customerId',
      as: 'quotations'
    });

    // Customer → Rental Orders
    User.hasMany(models.RentalOrder, {
      foreignKey: 'customerId',
      as: 'rentalOrders'
    });
  };

  return User;
};
