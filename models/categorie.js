module.exports = (sequelize, DataTypes) => {
  const Categorie = sequelize.define(
    'Categorie',
    {
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
      },
    },
    {
      tableName: 'categories',
    }
  );

  return Categorie;
};
