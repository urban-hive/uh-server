module.exports = (sequelize, DataType) => {
  const Dust = sequelize.define(
    'Dust',
    {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      pm: {
        type: DataType.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      measured_date: {
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
      }
    },
    {
      tableName: 'dusts',
      underscored: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false
    }
  );
  return Dust;
};
