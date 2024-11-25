<style>
.is-ht-sup-100 {
    color: green;
}
</style>


<template>
  <div>
    <h1>Bienvenue sur le Cart</h1>
    <table border="1">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Description</th>
          <th>Prix Unitaire</th>
          <th>Quantité</th>
          <th>HT</th>
          <th>TVA</th>
          <th>TTC</th>
        </tr>
      </thead>
      <tbody>
        
        <tr v-for="produit in produits" :key="produit.nom">
          <td>{{ produit.nom }}</td>
          <td>{{ produit.description }}</td>
          <td>{{ produit.prix_unitaire }}</td>
          <td>{{ produit.quantite }}</td>
          <td>{{ HT(produit.prix_unitaire, produit.quantite) }}</td>
          <td>{{ TVA(HT(produit.prix_unitaire, produit.quantite)) }}</td>
          <td>{{ TTC(HT(produit.prix_unitaire, produit.quantite), TVA(HT(produit.prix_unitaire, produit.quantite))) }}</td>
          
        </tr>
      </tbody>
      
    </table>
    <tfoot>
        
        <h1 v-if="isInf100(totalTVA)">Plus que {{100-totalTVA}} Pour le Livraison gratuite</h1>
        
        <div :class="{ 'is-ht-sup-100': isHTSUP100(totalTVA) }">
          <h1>
            TOTAL TVA :{{ totalTVA }}
          </h1>
          <h1>
            TOTAL TTC :{{ totalTTC }}
          </h1>
          
        </div>
        

    </tfoot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      produits: [
        { nom: 'Akondro', description: 'produit 1', prix_unitaire: 4000, quantite: 1 },
        { nom: 'Mangue', description: 'produit 2', prix_unitaire: 4000, quantite: 2 }
      ]
    };
  },
  computed: {
    totalTVA() {
      return this.produits.reduce((acc, produit) => {
        const HT = this.HT(produit.prix_unitaire, produit.quantite);
        return this.TVA(HT) + acc;
      }, 0);
    },
    totalTTC() {
      return this.produits.reduce((acc, produit) => {
        const HT = this.HT(produit.prix_unitaire, produit.quantite);
        const TVA = this.TVA(HT);
        return acc + this.TTC(HT, TVA);
      }, 0);
    }
  },
  methods: {
    HT(prix_unitaire, quantite) {
      return prix_unitaire * quantite;
    },
    TVA(HT) {
      return HT * 0.2;
    },
    TTC(HT, TVA) {
      return HT + TVA;
    },
    isHTSUP100(totalTVA) {
      return totalTVA > 100;
    },
    isInf100(totalTVA) {
      return totalTVA < 100;
    }
  }
};
</script>
