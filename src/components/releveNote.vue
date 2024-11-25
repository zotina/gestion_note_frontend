<template>
    <div>
      <h1>Notes de l'Étudiant</h1>
      
      <!-- Affichage des informations personnelles -->
      <div v-if="notes.length > 0">
        <p><strong>Nom :</strong> {{ notes[0].nom_etudiant }}</p>
        <p><strong>Prénom :</strong> {{ notes[0].prenom_etudiant }}</p>
        <p><strong>Date de naissance :</strong> {{ notes[0].date_naissance }}</p>
      </div>
      
      <!-- Affichage des notes par semestre -->
      <div v-for="semestre in semestres" :key="semestre">
        <h2>Semestre {{ semestre }}</h2>
  
        <table>
          <thead>
            <tr>
              <th>Code UE</th>
              <th>Intitulé</th>
              <th>Crédit</th>
              <th>Note sur 20</th>
              <th>Résultat</th>
              <th>Session</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="note in filterNotesBySemestre(semestre)" :key="note.code_ue">
              <td>{{ note.code_ue }}</td>
              <td>{{ note.intitule }}</td>
              <td>{{ note.credit }}</td>
              <td>{{ note.note_sur_20 }}</td>
              <td>{{ note.resultat }}</td>
              <td>{{ note.session }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td>{{ calculateTotalCredits(semestre) }}</td>
              <td>{{ calculateAverageGrade(semestre).toFixed(2) }}</td>
              <td>{{ calculateResult(semestre) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
  
      <!-- Affichage global des totaux et moyennes -->
      <div v-if="semestres.length > 0">
        <h2>Résumé Global</h2>
        <table>
          <thead>
            <tr>
              <th>Total Crédit</th>
              <th>Moyenne Générale</th>
              <th>Résultat Global</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ totalCreditsGlobal }}</td>
              <td>{{ averageGradeGlobal }}</td>
              <td>{{ globalResult }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      notes: [], // Liste des notes de l'étudiant
      semestres: [], // Liste des semestres distincts
    };
  },

  computed: {
    // Calcul du total des crédits global
    totalCreditsGlobal() {
      if (Array.isArray(this.semestres) && this.semestres.length > 0) {
        return this.semestres.reduce((total, semestre) => 
          total + this.calculateTotalCredits(semestre), 0
        );
      }
      return 0;
    },

    // Calcul de la moyenne générale globale
    averageGradeGlobal() {
      if (Array.isArray(this.semestres) && this.semestres.length > 0) {
        const totalNote = this.semestres.reduce((total, semestre) => {
          const avgGrade = this.calculateAverageGrade(semestre);
          const totalCredits = this.calculateTotalCredits(semestre);
          return total + (avgGrade * totalCredits);
        }, 0);

        const totalCredits = this.semestres.reduce((total, semestre) => 
          total + this.calculateTotalCredits(semestre), 0
        );

        return totalCredits > 0 ? (totalNote / totalCredits).toFixed(2) : 0;
      }
      return 0;
    },

    // Calcul du résultat global
    globalResult() {
      const avg = parseFloat(this.averageGradeGlobal);
      if (avg >= 16) {
        return 'ADMIS';
      } else if (avg >= 10) {
        return 'ADMIS';
      }
      return 'RECALE';
    },
  },

  mounted() {
    this.fetchNotes();
  },

  methods: {
    async fetchNotes() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/releve/note');
        this.notes = response.data;
        this.extractSemestres();
      } catch (error) {
        console.error("Il y a eu une erreur lors de la récupération des données :", error);
      }
    },

    extractSemestres() {
      this.semestres = [...new Set(this.notes.map(note => note.semestre))];
    },
    
    filterNotesBySemestre(semestre) {
      return this.notes.filter(note => note.semestre === semestre);
    },

    calculateTotalCredits(semestre) {
      return this.filterNotesBySemestre(semestre)
        .reduce((total, note) => total + note.credit, 0);
    },

    calculateAverageGrade(semestre) {
      const notes = this.filterNotesBySemestre(semestre);
      const totalNote = notes.reduce((total, note) => 
        total + parseFloat(note.note_sur_20), 0
      );
      return notes.length > 0 ? totalNote / notes.length : 0;
    },

    calculateResult(semestre) {
      const notes = this.filterNotesBySemestre(semestre);
      if (notes.length === 0) {
        return 'Aucune note disponible';
      }

      const totalNote = notes.reduce((total, note) => 
        total + parseFloat(note.note_sur_20), 0
      );
      const average = totalNote / notes.length;

      if (average >= 16) {
        return 'AS';
      } else if (average >= 12) {
        return 'P';
      } else if (average >= 10) {
        return 'C';
      }
      return 'E';
    },
  },
};
</script>  
  <style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  th {
    background-color: #f4f4f4;
  }
  
  h2 {
    margin-top: 20px;
  }
  
  tfoot {
    font-weight: bold;
  }
  
  tfoot td {
    background-color: #f9f9f9;
  }
  
  p {
    margin: 0;
    padding: 5px 0;
  }
  
  h2 {
    margin-top: 40px;
  }
  </style>
  