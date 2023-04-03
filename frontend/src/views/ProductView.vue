<script setup>

import { ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "../store/auth";

const { isAuthenticated, isAdmin, userData, token } = useAuthStore();

const route = useRoute();
const router = useRouter();

const productId = ref(route.params.productId);
const product = ref({});
const loading = ref(true);
const error = ref(false);
const countdown = ref("");
const countdownInterval = ref(null);

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString("fr-FR", options);
}

async function getProduct() {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId.value}`);
    product.value = await response.json();
    loading.value = false;
    startCountdown();
  } catch (err) {
    console.error(err);
    error.value = true;
    loading.value = false;
  }
}

async function getUserById(userId) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    const user = await response.json();
    return user.name;
  } catch (err) {
    console.error(err);
    return "";
  }
}

const sellerName = computed(() => {
  return getUserById(product.value.sellerId);
});

function startCountdown() {
  if (countdownInterval.value) clearInterval(countdownInterval.value);
  const endDate = new Date(product.value.endDate);
  const now = new Date();
  let diff = Math.floor((endDate - now) / 1000);
  if (diff <= 0) {
    countdown.value = "Vente terminée";
    return;
  }
  countdownInterval.value = setInterval(() => {
    diff--;
    if (diff <= 0) {
      clearInterval(countdownInterval.value);
      countdown.value = "Vente terminée";
      return;
    }
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    countdown.value = `${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

getProduct();
</script>

<template>
  <div class="row">
    <div class="text-center mt-4" data-test-loading>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div class="alert alert-danger mt-4" role="alert" data-test-error>
      Une erreur est survenue lors du chargement des produits.
    </div>
    <div class="row" data-test-product>
      <!-- Colonne de gauche : image et compte à rebours -->
      <div class="col-lg-4">
        <img :src="product.pictureUrl" alt="" class="img-fluid rounded mb-3" data-test-product-picture />
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Compte à rebours</h5>
          </div>
          <div class="card-body">
            <h6 class="card-subtitle mb-2 text-muted" data-test-countdown>
              Temps restant : {{ countdown }}
            </h6>
          </div>
        </div>
      </div>

      <!-- Colonne de droite : informations du produit et formulaire d'enchère -->
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-6">
            <h1 class="mb-3" data-test-product-name>
              {{ product.name }}
            </h1>
          </div>
          <div class="col-lg-6 text-end">
            <RouterLink :to="{ name: 'ProductEdition', params: { productId: 'TODO' } }" class="btn btn-primary"
              data-test-edit-product>
              Editer
            </RouterLink>
            &nbsp;
            <button class="btn btn-danger" data-test-delete-product>
              Supprimer
            </button>
          </div>
        </div>

        <h2 class="mb-3">Description</h2>
        <p data-test-product-description>
          {{ product.description }}
        </p>

        <h2 class="mb-3">Informations sur l'enchère</h2>
        <ul>
          <li data-test-product-price>Prix de départ : {{ product.originalPrice }} €</li>
          <li data-test-product-end-date>Date de fin : {{ formatDate(product.endDate) }}</li>
          <li>
            Vendeur :
            <router-link :to="{ name: 'User', params: { userId: product.sellerId } }" data-test-product-seller>
              {{ sellerName }}
            </router-link>
          </li>
        </ul>

        <h2 class="mb-3">Offres sur le produit</h2>
        <table class="table table-striped" data-test-bids>
          <thead>
            <tr>
              <th scope="col">Enchérisseur</th>
              <th scope="col">Offre</th>
              <th scope="col">Date</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i" data-test-bid>
              <td>
                <router-link :to="{ name: 'User', params: { userId: 'TODO' } }" data-test-bid-bidder>
                  charly
                </router-link>
              </td>
              <td data-test-bid-price>43 €</td>
              <td data-test-bid-date>22 mars 2026</td>
              <td>
                <button class="btn btn-danger btn-sm" data-test-delete-bid>
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p data-test-no-bids>Aucune offre pour le moment</p>

        <form data-test-bid-form>
          <div class="form-group">
            <label for="bidAmount">Votre offre :</label>
            <input type="number" class="form-control" id="bidAmount" data-test-bid-form-price />
            <small class="form-text text-muted">
              Le montant doit être supérieur à 10 €.
            </small>
          </div>
          <button type="submit" class="btn btn-primary" disabled data-test-submit-bid>
            Enchérir
          </button>
        </form>
      </div>
    </div>
  </div>
</template>