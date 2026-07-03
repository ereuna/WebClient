# Ereuna — PostgreSQL Schema

## File Order

Run files in numerical order. Each file depends on prior ones.

| File | Domain | Schema |
|------|--------|--------|
| `00_init.sql` | Schemas + Extensions | — |
| `01_core.sql` | Shared References | `core` |
| `02_identity.sql` | Identity & Access | `identity` |
| `03_repository.sql` | Repository | `repository` |
| `04_dataset.sql` | Dataset | `dataset` |
| `05_model.sql` | Model | `model` |
| `06_training.sql` | Training | `training` |
| `07_inference.sql` | Inference | `inference` |
| `08_deployment.sql` | Deployment | `deployment` |
| `09_pipeline.sql` | Pipeline | `pipeline` |
| `10_explainability.sql` | Explainability | `explainability` |
| `11_search.sql` | Search | `search` |
| `12_billing.sql` | Billing | `billing` |
| `13_notification.sql` | Notification | `notification` |
| `14_audit.sql` | Audit | `audit` |
| `15_governance.sql` | Governance | `governance` |

## Apply All

```bash
for f in sql/[0-9]*.sql; do psql $DATABASE_URL -f "$f"; done
```
