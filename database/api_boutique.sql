-- ============================================================
-- Base de données : api_boutique
-- Projet : api-boutique (Node.js / Express / Sequelize / MySQL)
-- ============================================================
-- Ce fichier crée la base, les tables et insère des données
-- d'exemple. Il est compatible avec le modèle Sequelize fourni
-- dans le projet (models/produit.js, models/categorie.js).
-- ============================================================

CREATE DATABASE IF NOT EXISTS api_boutique
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE api_boutique;

-- ------------------------------------------------------------
-- Table : categories
-- ------------------------------------------------------------
DROP TABLE IF EXISTS produits;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL UNIQUE,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Table : produits
-- ------------------------------------------------------------
CREATE TABLE produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  description TEXT NULL,
  prix FLOAT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  categorieId INT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_produit_categorie
    FOREIGN KEY (categorieId) REFERENCES categories(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Données d'exemple : categories
-- ------------------------------------------------------------
INSERT INTO categories (id, nom) VALUES
  (1, 'Informatique'),
  (2, 'Mobilier de bureau'),
  (3, 'Accessoires');

-- ------------------------------------------------------------
-- Données d'exemple : produits
-- ------------------------------------------------------------
INSERT INTO produits (nom, description, prix, stock, categorieId) VALUES
  ('Clavier mécanique', 'Clavier RGB switches rouges, rétroéclairé', 59.99, 25, 1),
  ('Souris sans fil', 'Souris ergonomique 1600 DPI', 24.99, 40, 1),
  ('Écran 27 pouces', 'Dalle IPS, résolution 2560x1440', 199.99, 8, 1),
  ('Chaise de bureau', 'Chaise ergonomique avec support lombaire', 149.00, 12, 2),
  ('Bureau réglable en hauteur', 'Bureau électrique assis-debout', 349.00, 5, 2),
  ('Casque audio filaire', 'Casque avec micro intégré', 34.90, 30, 3),
  ('Tapis de souris XXL', 'Tapis de souris grand format', 14.90, 60, 3),
  ('Webcam Full HD', 'Webcam 1080p avec micro intégré', 45.00, 0, 1);

-- ============================================================
-- Fin du script. La base "api_boutique" est prête à l'emploi.
-- ============================================================
