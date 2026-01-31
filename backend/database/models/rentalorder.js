module.exports = (sequelize, DataTypes) => {
  const RentalOrder = sequelize.define('RentalOrder', {
    quotationId: DataTypes.INTEGER,
    customerId: DataTypes.INTEGER,
    status: DataTypes.STRING
  });

  RentalOrder.associate = (models) => {
    RentalOrder.belongsTo(models.Quotation, {
      foreignKey: 'quotationId'
    });

    RentalOrder.belongsTo(models.User, {
      foreignKey: 'customerId',
      as: 'customer'
    });

    RentalOrder.hasMany(models.Reservation, {
      foreignKey: 'rentalOrderId'
    });

    RentalOrder.hasOne(models.Invoice, {
      foreignKey: 'rentalOrderId'
    });

    RentalOrder.hasOne(models.Return, {
      foreignKey: 'rentalOrderId'
    });
  };

  return RentalOrder;
};
