import { useState } from 'react';
import CrudPage from '../components/CrudPage';
import EtatBadge, { EtatLegende } from '../components/EtatBadge';
import { exerciceApi, budgetApi } from '../api/commune';

const money = (v) =>
  `${Number(v || 0).toLocaleString('fr-FR')} Ar`;

export default function Exercices() {
  const [selectedExercice, setSelectedExercice] = useState(null);

  const closeDetails = () => {
    setSelectedExercice(null);
  };

  return (
    <>
      {/* =========================================================
          STYLE DE LA PAGE
          ========================================================= */}
      <style>{`
        .exercices-page {
          width: 100%;
          padding: 0;
        }

        /* Agrandir la zone du tableau */
        .exercices-page table {
          width: 100% !important;
          min-width: 950px;
        }

        /* Hauteur des lignes */
        .exercices-page table tbody tr {
          height: 62px;
        }

        .exercices-page table th,
        .exercices-page table td {
          padding: 12px 10px !important;
          vertical-align: middle;
        }

        /* Alignement des montants */
        .exercices-page table td:nth-child(2),
        .exercices-page table td:nth-child(3),
        .exercices-page table td:nth-child(4),
        .exercices-page table td:nth-child(5) {
          text-align: right;
          white-space: nowrap;
        }

        /* Année */
        .exercices-page table td:first-child {
          font-weight: 600;
          white-space: nowrap;
        }

        /* Fonds libre */
        .fonds-libre {
          font-weight: 700;
          white-space: nowrap;
        }

        /* Zone détails */
        .details-cell {
          min-width: 180px;
        }

        .details-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          color: #1e293b;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .details-button:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .details-button .eye {
          font-size: 16px;
        }

        /* =====================================================
           MODALE
           ===================================================== */

        .exercice-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(15, 23, 42, 0.45);
        }

        .exercice-modal {
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: #64748b;
          font-size: 22px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        .modal-body {
          padding: 22px;
        }

        /* Résumé */
        .exercice-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 22px;
        }

        .summary-card {
          padding: 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }

        .summary-label {
          display: block;
          margin-bottom: 6px;
          color: #64748b;
          font-size: 12px;
        }

        .summary-value {
          display: block;
          color: #0f172a;
          font-size: 16px;
          font-weight: 700;
        }

        /* Section règles */
        .rules-section {
          margin-top: 18px;
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: #ffffff;
        }

        .rules-title {
          margin: 0 0 14px 0;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
        }

        .rules-content {
          color: #475569;
          line-height: 1.7;
        }

        /* Icônes des règles */
        .rule-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }

        .rule-item:last-child {
          border-bottom: none;
        }

        .rule-icon {
          min-width: 24px;
          font-size: 18px;
        }

        .rule-text {
          flex: 1;
        }

        /* Footer */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          padding: 16px 22px;
          border-top: 1px solid #e2e8f0;
        }

        .close-button {
          padding: 9px 18px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background: #ffffff;
          color: #334155;
          cursor: pointer;
          font-size: 14px;
        }

        .close-button:hover {
          background: #f1f5f9;
        }

        /* =====================================================
           RESPONSIVE
           ===================================================== */

        @media (max-width: 800px) {
          .exercices-page {
            overflow-x: auto;
          }

          .exercice-summary {
            grid-template-columns: 1fr;
          }

          .exercice-modal {
            max-width: 95%;
          }
        }
      `}</style>

      <div className="exercices-page">
        <CrudPage
          title="Exercices"
          api={exerciceApi}
          searchFields={[{ name: 'annee', numeric: true }]}
          canCreate={false}
          canEdit={false}
          canDelete={false}
          fields={[]}

          columns={[
            {
              key: 'annee',
              label: 'Année',
            },

            {
              key: 'excedent_n_moins_1',
              label: 'Excédent N-1',
              render: money,
            },

            {
              key: 'total_recettes',
              label: 'Total recettes',
              render: money,
            },

            {
              key: 'total_depenses',
              label: 'Total dépenses',
              render: money,
            },

            {
              key: 'fonds_libre',
              label: 'Fonds libre',
              render: (v) => (
                <span className="fonds-libre">
                  {money(v)}
                </span>
              ),
            },

            {
              key: 'etat',
              label: 'État',
              render: (v) => <EtatBadge etat={v} />,
            },
          ]}

          /*
           * ======================================================
           * ACTION / DÉTAILS
           * ======================================================
           */
          extraActions={(row) => (
            <div className="details-cell">
              <button
                type="button"
                className="details-button"
                onClick={() => setSelectedExercice(row)}
                title={`Voir les détails de l'exercice ${row.annee}`}
              >
                <span>Voir les détails</span>
              </button>
            </div>
          )}

          /*
           * ======================================================
           * DÉTAIL DES BUDGETS
           * ======================================================
           */
          detail={{
            title: (r) =>
              `Budgets de l'exercice ${r.annee}`,

            columns: [
              {
                key: 'code_compte',
                label: 'Compte',
              },

              {
                key: 'objet',
                label: 'Objet',
              },

              {
                key: 'credit_ouvert',
                label: 'Crédit ouvert',
                render: money,
              },

              {
                key: 'cumule',
                label: 'Cumul',
                render: money,
              },

              {
                key: 'disponible',
                label: 'Disponible',
                render: money,
              },
            ],

            load: (r) =>
              budgetApi.list([
                ['exercice_id', '=', r.id],
              ]),

            filename: (r) =>
              `Budgets_${r.annee}`,
          }}
        />
      </div>

      {/* =========================================================
          MODALE DÉTAILS EXERCICE
          ========================================================= */}
      {selectedExercice && (
        <div
          className="exercice-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="exercice-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* HEADER */}
            <div className="modal-header">
              <h2 className="modal-title">
                Exercice {selectedExercice.annee}
              </h2>

              <button
                type="button"
                className="modal-close"
                onClick={closeDetails}
                aria-label="Fermer"
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/* ============================
                  RÉSUMÉ FINANCIER
                  ============================ */}
              <div className="exercice-summary">

                <div className="summary-card">
                  <span className="summary-label">
                    Excédent N-1
                  </span>

                  <span className="summary-value">
                    {money(
                      selectedExercice.excedent_n_moins_1
                    )}
                  </span>
                </div>

                <div className="summary-card">
                  <span className="summary-label">
                    Total recettes
                  </span>

                  <span className="summary-value">
                    {money(
                      selectedExercice.total_recettes
                    )}
                  </span>
                </div>

                <div className="summary-card">
                  <span className="summary-label">
                    Fonds libre
                  </span>

                  <span className="summary-value">
                    {money(
                      selectedExercice.fonds_libre
                    )}
                  </span>
                </div>

              </div>

              {/* ============================
                  ÉTAT
                  ============================ */}
              <div className="rules-section">

                <h3 className="rules-title">
                  État de l'exercice
                </h3>

                <div className="rules-content">
                  <EtatBadge
                    etat={selectedExercice.etat}
                  />
                </div>

              </div>

              {/* ============================
                  RÈGLES DE GESTION
                  ============================ */}
              <div className="rules-section">

                <h3 className="rules-title">
                  Règles de gestion
                </h3>

                <div className="rules-content">
                  <EtatLegende
                    row={selectedExercice}
                  />
                </div>

              </div>

              {/* ============================
                  INFORMATIONS FINANCIÈRES
                  ============================ */}
              <div className="rules-section">

                <h3 className="rules-title">
                  Situation financière
                </h3>

                <div className="rule-item">
                  <span className="rule-icon">
                    💰
                  </span>

                  <span className="rule-text">
                    <strong>Recettes :</strong>{' '}
                    {money(
                      selectedExercice.total_recettes
                    )}
                  </span>
                </div>

                <div className="rule-item">
                  <span className="rule-icon">
                    💸
                  </span>

                  <span className="rule-text">
                    <strong>Dépenses :</strong>{' '}
                    {money(
                      selectedExercice.total_depenses
                    )}
                  </span>
                </div>

                <div className="rule-item">
                  <span className="rule-icon">
                    📊
                  </span>

                  <span className="rule-text">
                    <strong>Fonds libre :</strong>{' '}
                    {money(
                      selectedExercice.fonds_libre
                    )}
                  </span>
                </div>

              </div>

              {/* ============================
                  MESSAGE SELON L'ÉTAT
                  ============================ */}
              {selectedExercice.etat === 'a_venir' && (
                <div className="rules-section">
                  <h3 className="rules-title">
                    📅 Exercice à venir
                  </h3>

                  <div className="rules-content">
                    Cet exercice n'est pas encore ouvert.
                    Aucune opération financière ne doit
                    être effectuée avant sa date d'ouverture.
                  </div>
                </div>
              )}

              {selectedExercice.etat === 'ouvert' && (
                <div className="rules-section">
                  <h3 className="rules-title">
                    🟢 Exercice ouvert
                  </h3>

                  <div className="rules-content">
                    Les opérations autorisées peuvent
                    être enregistrées conformément aux
                    périodes définies pour cet exercice.
                  </div>
                </div>
              )}

              {selectedExercice.etat === 'cloture' && (
                <div className="rules-section">
                  <h3 className="rules-title">
                    🔒 Exercice clôturé
                  </h3>

                  <div className="rules-content">
                    Cet exercice est verrouillé.
                    Aucune modification ne peut être
                    effectuée sur les données de cet exercice.
                  </div>
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                type="button"
                className="close-button"
                onClick={closeDetails}
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}