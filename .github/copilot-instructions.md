# GitHub Copilot / AI agent instructions for CarRental_Ecommerce

## Quick summary
- Django monorepo with domain apps: `users`, `sellers`, `cars`, `orders`, `authenticate`.
- API implemented with Django REST Framework (DRF) and `SimpleRouter` + `ViewSet` patterns.
- Auth uses `rest_framework_simplejwt` (JWT tokens) via `authenticate` ViewSets.
- `AUTH_USER_MODEL` is `users.User` (email as `USERNAME_FIELD`).

---

## Setup & common commands ✅
- Activate dev venv: `env\Scripts\activate` (Windows). See `STEPS.md` for upstream install steps.
- Install dependencies per `STEPS.md` (no `requirements.txt` in repo) — typical pip installs: Django, djangorestframework, django-filter, drf-nested-routers, djangorestframework-simplejwt, psycopg2-binary.
- DB: `backend/backend/settings.py` defaults to PostgreSQL (local `postgres` user). For quick dev you may change `DATABASES` to sqlite or set env vars.
- Apply migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`
- Run server: `python manage.py runserver`
- Run tests: `python manage.py test` (app-specific: `python manage.py test users`)

---

## Structure & patterns to follow 🔧
- Apps are domain-oriented (e.g., `users`, `cars`, `orders`, `sellers`). Add features inside the appropriate app.
- API pattern: `serializers.py` -> `views.py` (ViewSets) -> `urls.py` (register with `rest_framework.routers.SimpleRouter`). Example: `users/urls.py` registers `RegisterViewSet`, `LoginViewSet`, and CRUD viewsets (`reviews`, `wishlist`).
- Use `serializer.is_valid(raise_exception=True)` consistently (see `authenticate/views.py`). Handle `TokenError` when working with JWT refresh endpoints.
- Models usually use `AutoField` PKs, `unique_together` and `indexes`. Follow existing conventions (see `users/models.py` for `PaymentMethod.save()` and validation patterns).
- Custom manager helpers: `UserManager.get_object_by_public_id` raises `Http404` on missing resources — reuse for consistent 404 behavior.

---

## Auth & security notes 🔐
- JWT via `rest_framework_simplejwt` — tokens are issued by `authenticate` viewsets and used as default auth class in `settings.py` (`REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES']`).
- `AUTH_USER_MODEL = 'users.User'` — user creation expects `email` and requires `first_name` and `last_name` in `REQUIRED_FIELDS`. Use `UserManager.create_user()` for programmatic user creation.
- Secrets & DB credentials are currently in `settings.py` (development). For deployment, use env vars or secrets manager (note in PRs if you change this).

---

## Integration & external systems ⚙️
- Payments: models and enums reference `stripe`, `razorpay`, `paypal` in `users.models.PaymentMethod` and `orders` models — treat payment providers as external services; tests should mock provider interactions.
- Third-party libs: DRF, DRF SimpleJWT, Django Filters, DRF Nested Routers; make sure compatibility when upgrading.

---

## How to add an API endpoint (example) 💡
1. Add serializer in `app/serializers.py`.
2. Create a `ViewSet` in `app/views.py` (use `ModelViewSet` or `ViewSet` depending on needs).
3. Register it in `app/urls.py` using `routers.SimpleRouter()` and include those URLs in `backend/urls.py` if not already included. See `users/urls.py` for the pattern.
4. Add tests to `app/tests.py` and run `python manage.py test app`.

---

## Tests & data migrations ⚠️
- Migrations live under `*/migrations/`. Add `makemigrations` and commit generated files in the PR.
- Tests are standard Django tests (`tests.py` in each app). Use factories or `TestCase` fixtures; keep DB changes local to tests using `TestCase` or transactional tests.

---

## Files/places to inspect for context (shortlist) 📚
- `backend/backend/settings.py` — DB, auth, installed apps
- `backend/backend/urls.py` — included app routes
- `users/models.py`, `users/serializers.py`, `users/urls.py` — custom user model patterns
- `authenticate/views.py` — register/login/refresh examples
- `orders/` and `cars/` apps — domain examples for model designs and API patterns
- `STEPS.md` and `README.md` — setup and project intent

---

If any part is unclear or you'd like me to emphasize a different area (e.g., testing patterns, CI commands, or contributor guidelines), tell me which section to expand or correct and I’ll iterate. ✅