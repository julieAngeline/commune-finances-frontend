import CrudPage from '../components/CrudPage';
import { recetteApi } from '../api/commune';

const money = (v) =>
  `${Number(v || 0).toLocaleString('fr-FR')} Ar`;

const dateFr = (v) => {
  if (!v) return '';

  const date = new Date(v);

  if (Number.isNaN(date.getTime())) {
    return v;
  }

  return date.toLocaleDateString('fr-FR');
};

export default function Recettes() {
  return (
    <>
      <style>{`
        .recettes-page {
          width: 100%;
        }

        /* Tableau plus large */
        .recettes-page table {
          width: 100% !important;
          min-width: 850px;
          border-collapse: collapse !important;
        }

        /* En-tête */
        .recettes-page table thead th {
          padding: 13px 12px !important;
          text-align: left;
          font-weight: 600;
          white-space: nowrap;
          background: #f8fafc;
        }

        /* Cellules */
        .recettes-page table tbody td {
          padding: 13px 12px !important;
          vertical-align: middle;
          white-space: nowrap;
        }

        /* Lignes plus aérées */
        .recettes-page table tbody tr {
          height: 58px;
        }

        /* Numéro d'ordre */
        .numero-ordre {
          font-weight: 600;
        }

        /* Montant */
        .montant-recette {
          font-weight: 700;
          white-space: nowrap;
          text-align: right;
        }

        /* Dates */
        .date-recette {
          white-space: nowrap;
        }

        /* Exercice */
        .exercice-recette {
          font-weight: 600;
          text-align: center;
        }

        /* Petit espace autour du tableau */
        .recettes-page {
          overflow-x: auto;
        }
      `}</style>

      <div className="recettes-page">
        <CrudPage
          title="Recettes"
          api={recetteApi}

          columns={[
            {
              key: 'numero_ordre_recette',
              label: 'N° Ordre',
              render: (v) => (
                <span className="numero-ordre">
                  {v || '-'}
                </span>
              ),
            },

            {
              key: 'date_ordre_recette',
              label: 'Date ordre',
              render: (v) => (
                <span className="date-recette">
                  {dateFr(v)}
                </span>
              ),
            },

            {
              key: 'date_versement',
              label: 'Versement',
              render: (v) => (
                <span className="date-recette">
                  {dateFr(v)}
                </span>
              ),
            },

            {
              key: 'montant',
              label: 'Montant',
              render: (v) => (
                <span className="montant-recette">
                  {money(v)}
                </span>
              ),
            },

            {
              key: 'exercice_id',
              label: 'Exercice',
              render: (v) => (
                <span className="exercice-recette">
                  {Array.isArray(v) ? v[1] : v || '-'}
                </span>
              ),
            },
          ]}

          fields={[
            {
              name: 'exercice_id',
              label: 'Exercice',
              type: 'm2o',
              relation: 'commune.exercice',
              labelField: 'annee',
            },

            {
              name: 'date_versement',
              label: 'Date de versement',
              type: 'date',
            },

            {
              name: 'numero_declaration_recette',
              label: 'N° Déclaration',
              type: 'text',
            },

            {
              name: 'date_declaration_recette',
              label: 'Date déclaration',
              type: 'date',
            },

            {
              name: 'numero_ordre_recette',
              label: 'N° Ordre de recette',
              type: 'text',
            },

            {
              name: 'date_ordre_recette',
              label: "Date de l'ordre",
              type: 'date',
            },

            {
              name: 'periode_debut',
              label: 'Période début',
              type: 'date',
            },

            {
              name: 'periode_fin',
              label: 'Période fin',
              type: 'date',
            },

            {
              name: 'montant',
              label: 'Montant',
              type: 'number',
            },
          ]}
        />
      </div>
    </>
  );
}