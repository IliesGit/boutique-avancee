# API Boutique

Projet complet **Node.js / Express / Sequelize / MySQL** (back-end) + **HTML / Bootstrap / JavaScript** (front-end), utilisé tout au long du cours. C'est une application de gestion de produits (CRUD complet) avec catégories.

---

## 🚀 Installation — étape par étape

### 1. Décompresser et ouvrir le projet

Décompressez le fichier `.zip`, puis ouvrez le dossier `api-boutique` dans VS Code.

### 2. Installer les dépendances Node.js

Ouvrez un terminal dans VS Code (`Terminal > Nouveau terminal`) et lancez :

```bash
npm install
```

### 3. Créer la base de données MySQL

Assurez-vous que **MySQL est démarré** sur votre machine, puis importez le fichier fourni dans `database/api_boutique.sql`.

**Option A — en ligne de commande :**

```bash
mysql -u root -p < database/api_boutique.sql
```

**Option B — avec MySQL Workbench / phpMyAdmin / DBeaver :**

Ouvrez le fichier `database/api_boutique.sql` et exécutez-le entièrement (bouton "Exécuter le script SQL").

Ce script crée automatiquement :
- la base `api_boutique`
- les tables `categories` et `produits` (avec leur relation 1-N)
- quelques données d'exemple (3 catégories, 8 produits)

### 4. Configurer la connexion à la base de données

Ouvrez le fichier `.env` à la racine du projet et adaptez si besoin :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=       # <-- mettez ici VOTRE mot de passe MySQL
DB_NAME=api_boutique
DB_PORT=3306
PORT=5000
```

> ⚠️ Si votre utilisateur MySQL root n'a pas de mot de passe, laissez `DB_PASSWORD` vide (comme ci-dessus). Sinon, indiquez votre mot de passe.

### 5. Démarrer le serveur

```bash
npm run dev
```

Vous devriez voir dans le terminal :

```
✅ Connexion à MySQL réussie.
✅ Serveur démarré sur http://localhost:5000
   Interface web : http://localhost:5000/
   API           : http://localhost:5000/api/produits
```

### 6. Ouvrir l'application dans le navigateur

Rendez-vous sur **http://localhost:5000/** : l'interface (liste des produits, formulaire d'ajout, filtre par catégorie) doit s'afficher directement, déjà connectée à l'API et à la base de données.

---

## 🧭 Structure du projet (architecture MVC)

```
api-boutique/
├── config/
│   └── database.js          # Connexion Sequelize à MySQL
├── models/
│   ├── index.js              # Chargement des modèles + relations
│   ├── produit.js
│   └── categorie.js
├── controllers/
│   ├── produit.controller.js # Logique métier CRUD Produit
│   └── categorie.controller.js
├── routes/
│   ├── produit.routes.js     # Endpoints /api/produits
│   └── categorie.routes.js   # Endpoints /api/categories
├── public/                   # Front-end (servi directement par Express)
│   ├── index.html
│   ├── css/style.css
│   └── js/script.js
├── database/
│   └── api_boutique.sql      # Script de création + données d'exemple
├── .env                       # Configuration (à adapter)
├── server.js                  # Point d'entrée du serveur
└── package.json
```

## 📡 Endpoints de l'API

| Méthode | Endpoint              | Action                        |
|---------|------------------------|--------------------------------|
| GET     | /api/produits           | Liste tous les produits        |
| GET     | /api/produits/:id       | Récupère un produit précis     |
| POST    | /api/produits           | Crée un nouveau produit        |
| PUT     | /api/produits/:id       | Met à jour un produit          |
| DELETE  | /api/produits/:id       | Supprime un produit            |
| GET     | /api/categories         | Liste toutes les catégories    |
| POST    | /api/categories         | Crée une nouvelle catégorie    |

## 🛠️ Dépannage

| Erreur au démarrage | Cause probable | Solution |
|---|---|---|
| `ER_ACCESS_DENIED_ERROR` | Mauvais utilisateur/mot de passe | Vérifiez `DB_USER` et `DB_PASSWORD` dans `.env` |
| `ER_BAD_DB_ERROR` / `Unknown database` | La base n'existe pas encore | Réimportez `database/api_boutique.sql` |
| `ECONNREFUSED` | MySQL n'est pas démarré | Démarrez le service MySQL |
| `EADDRINUSE` | Le port 5000 est déjà utilisé | Changez `PORT` dans `.env` |
| Page blanche sur localhost:5000 | Le serveur ne s'est pas connecté à MySQL | Regardez le terminal : le message d'erreur y est détaillé |

---

Ce projet reprend exactement les exemples utilisés dans les chapitres **Environnement & Architecture MVC**, **MySQL & Sequelize**, **API REST**, **JavaScript**, **Bootstrap** et **Consommation de l'API**.
