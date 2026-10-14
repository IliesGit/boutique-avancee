// ============================================================
// API Boutique — script.js
// Consomme l'API /api/produits et /api/categories (même origine,
// donc pas besoin d'URL absolue ni de configuration CORS côté client).
// ============================================================

const API_PRODUITS = '/api/produits';
const API_CATEGORIES = '/api/categories';

// ---- Références DOM ----
const formProduit = document.querySelector('#formProduit');
const champId = document.querySelector('#produitId');
const champNom = document.querySelector('#champNom');
const champDescription = document.querySelector('#champDescription');
const champPrix = document.querySelector('#champPrix');
const champStock = document.querySelector('#champStock');
const champCategorie = document.querySelector('#champCategorie');
const filtreCategorie = document.querySelector('#filtreCategorie');
const titreFormulaire = document.querySelector('#titreFormulaire');
const boutonSubmit = document.querySelector('#boutonSubmit');
const boutonAnnuler = document.querySelector('#boutonAnnuler');
const listeProduits = document.querySelector('#listeProduits');
const compteurProduits = document.querySelector('#compteurProduits');
const chargementEl = document.querySelector('#chargement');
const zoneMessage = document.querySelector('#zoneMessage');
const nomProduitASupprimer = document.querySelector('#nomProduitASupprimer');
const boutonConfirmerSuppression = document.querySelector('#boutonConfirmerSuppression');

let idASupprimer = null;
let modalSuppression;

// ---- Utilitaires d'affichage ----
function afficherMessage(texte, type = 'success') {
  zoneMessage.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${texte}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

function afficherChargement(actif) {
  chargementEl.classList.toggle('d-none', !actif);
  listeProduits.classList.toggle('d-none', actif);
}

function formatPrix(prix) {
  return Number(prix).toFixed(2) + ' €';
}

// ---- Catégories ----
async function chargerCategories() {
  try {
    const response = await fetch(API_CATEGORIES);
    if (!response.ok) throw new Error('Erreur ' + response.status);
    const categories = await response.json();

    const options = categories.map((c) => `<option value="${c.id}">${c.nom}</option>`).join('');
    champCategorie.innerHTML = '<option value="">— Aucune —</option>' + options;
    filtreCategorie.innerHTML = '<option value="">Toutes les catégories</option>' + options;
  } catch (error) {
    console.error('Erreur lors du chargement des catégories :', error);
  }
}

// ---- Construire le HTML d'une carte produit ----
function carteProduitHTML(produit) {
  const enRupture = produit.stock === 0;
  const nomCategorie = produit.categorie ? produit.categorie.nom : 'Sans catégorie';

  return `
    <div class="col-12 col-md-6">
      <div class="card carte-produit shadow-sm">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="card-title mb-1">${produit.nom}</h5>
            <span class="badge ${enRupture ? 'badge-rupture' : 'bg-success'}">
              ${enRupture ? 'Rupture' : produit.stock + ' en stock'}
            </span>
          </div>
          <span class="badge bg-light text-dark border mb-2 align-self-start">${nomCategorie}</span>
          <p class="card-text text-muted small flex-grow-1">${produit.description ? produit.description : ''}</p>
          <p class="prix mb-2">${formatPrix(produit.prix)}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-primary btn-modifier" data-id="${produit.id}">Modifier</button>
            <button class="btn btn-sm btn-outline-danger btn-supprimer" data-id="${produit.id}" data-nom="${produit.nom}">Supprimer</button>
          </div>
        </div>
      </div>
    </div>`;
}

// ---- Charger et afficher les produits ----
async function chargerProduits() {
  afficherChargement(true);
  try {
    const categorieId = filtreCategorie.value;
    const url = categorieId ? `${API_PRODUITS}?categorieId=${categorieId}` : API_PRODUITS;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur ' + response.status);
    const produits = await response.json();

    listeProduits.innerHTML = produits.length
      ? produits.map(carteProduitHTML).join('')
      : '<p class="text-muted">Aucun produit à afficher.</p>';

    compteurProduits.textContent = `${produits.length} produit${produits.length > 1 ? 's' : ''}`;
  } catch (error) {
    console.error(error);
    afficherMessage("Impossible de charger les produits. Vérifiez que le serveur et MySQL sont bien démarrés.", 'danger');
  } finally {
    afficherChargement(false);
  }
}

// ---- Réinitialiser le formulaire (mode "ajout") ----
function reinitialiserFormulaire() {
  formProduit.reset();
  champId.value = '';
  titreFormulaire.textContent = 'Ajouter un produit';
  boutonSubmit.textContent = 'Ajouter le produit';
  boutonAnnuler.classList.add('d-none');
}

// ---- Pré-remplir le formulaire pour modification ----
async function preparerModification(id) {
  try {
    const response = await fetch(`${API_PRODUITS}/${id}`);
    if (!response.ok) throw new Error('Erreur ' + response.status);
    const produit = await response.json();

    champId.value = produit.id;
    champNom.value = produit.nom;
    champDescription.value = produit.description || '';
    champPrix.value = produit.prix;
    champStock.value = produit.stock;
    champCategorie.value = produit.categorieId || '';

    titreFormulaire.textContent = `Modifier : ${produit.nom}`;
    boutonSubmit.textContent = 'Enregistrer les modifications';
    boutonAnnuler.classList.remove('d-none');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    afficherMessage("Impossible de charger ce produit.", 'danger');
  }
}

// ---- Soumission du formulaire (création OU modification) ----
formProduit.addEventListener('submit', async (event) => {
  event.preventDefault();

  const donnees = {
    nom: champNom.value.trim(),
    description: champDescription.value.trim(),
    prix: parseFloat(champPrix.value),
    stock: parseInt(champStock.value, 10) || 0,
    categorieId: champCategorie.value || null,
  };

  const id = champId.value;
  const enModification = Boolean(id);

  boutonSubmit.disabled = true;
  try {
    const response = await fetch(enModification ? `${API_PRODUITS}/${id}` : API_PRODUITS, {
      method: enModification ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees),
    });

    if (!response.ok) {
      const erreur = await response.json().catch(() => ({}));
      throw new Error(erreur.message || 'Erreur ' + response.status);
    }

    afficherMessage(enModification ? 'Produit modifié avec succès.' : 'Produit ajouté avec succès.');
    reinitialiserFormulaire();
    await chargerProduits();
  } catch (error) {
    console.error(error);
    afficherMessage(error.message, 'danger');
  } finally {
    boutonSubmit.disabled = false;
  }
});

boutonAnnuler.addEventListener('click', reinitialiserFormulaire);

// ---- Délégation d'événements pour les boutons Modifier / Supprimer ----
listeProduits.addEventListener('click', (event) => {
  const boutonModifier = event.target.closest('.btn-modifier');
  const boutonSupprimer = event.target.closest('.btn-supprimer');

  if (boutonModifier) {
    preparerModification(boutonModifier.dataset.id);
  }

  if (boutonSupprimer) {
    idASupprimer = boutonSupprimer.dataset.id;
    nomProduitASupprimer.textContent = boutonSupprimer.dataset.nom;
    modalSuppression.show();
  }
});

// ---- Confirmation de suppression ----
boutonConfirmerSuppression.addEventListener('click', async () => {
  if (!idASupprimer) return;

  try {
    const response = await fetch(`${API_PRODUITS}/${idASupprimer}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erreur ' + response.status);

    afficherMessage('Produit supprimé avec succès.');
    modalSuppression.hide();
    await chargerProduits();
  } catch (error) {
    console.error(error);
    afficherMessage("Impossible de supprimer ce produit.", 'danger');
  } finally {
    idASupprimer = null;
  }
});

// ---- Filtre par catégorie ----
filtreCategorie.addEventListener('change', chargerProduits);

// ---- Démarrage de l'application ----
document.addEventListener('DOMContentLoaded', async () => {
  modalSuppression = new bootstrap.Modal(document.querySelector('#modalSuppression'));
  await chargerCategories();
  await chargerProduits();
});
