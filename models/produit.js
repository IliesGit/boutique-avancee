module.exports = (sequelize, DataTypes) => {
  const Produit = sequelize.define(
    'Produit',
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      prix: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0 },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 },
      },
      categorieId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'produits',
    }
  );

  return Produit;
};
