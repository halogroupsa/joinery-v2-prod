.PHONY: help install dev dev-functions build build-prod verify-prod start lint typecheck keywords keywords-install assets assets-images assets-images-prune assets-posters assets-og deploy tail clean sync-to-prod sync-from-prod sync-to-prod-dry sync-from-prod-dry sync-prod-status sync-to-peer sync-from-peer

# Cloudflare Pages project name, read from this checkout's own wrangler.toml.
#
# Derived rather than hardcoded because the Makefile is synced between the
# staging and production checkouts but wrangler.toml is not (see the sync
# section below) — so each tree targets its own Pages project automatically.
# Production is "joinery-v2-prod": the joinery.ae apex CNAMEs to
# joinery-v2-prod.pages.dev.
#
# Override on the command line if needed:
#   make tail PAGES_PROJECT=other-name
PAGES_PROJECT ?= $(shell sed -n 's/^name[[:space:]]*=[[:space:]]*"\(.*\)"/\1/p' $(dir $(abspath $(lastword $(MAKEFILE_LIST))))wrangler.toml 2>/dev/null)
KEYWORDS_VENV ?= .venv-keywords
KEYWORDS_PYTHON := $(KEYWORDS_VENV)/bin/python

help:
	@echo "Joinery AE — available targets:"
	@echo ""
	@echo "  make install              Install dependencies (npm ci)"
	@echo "  make dev                  Start the Next.js dev server"
	@echo "  make dev-functions        Build + serve the static export via wrangler"
	@echo "  make build                Static export for local/staging (next build → out/)"
	@echo "  make build-prod           Static export pinned to https://joinery.ae"
	@echo "  make verify-prod          Assert out/ is indexable and canonical on joinery.ae"
	@echo "  make start                Serve the production build"
	@echo "  make lint                 Run ESLint"
	@echo "  make typecheck            Run TypeScript type-check (no emit)"
	@echo "  make keywords-install     Create the local Keyword Planner environment"
	@echo "  make keywords             Refresh the UAE joinery keyword catalog"
	@echo "  make assets               Optimize images"
	@echo "  make assets-images        Optimize images only"
	@echo "  make assets-images-prune  Optimize images + prune orphaned outputs"
	@echo "  make assets-posters       Generate video posters (SCRIPT MISSING — see below)"
	@echo "  make assets-og            Regenerate the per-page share cards (public/og/)"
	@echo "  make deploy               Build and deploy out/ to Cloudflare Pages"
	@echo "  make tail                 Stream live logs from the deployed Pages project"
	@echo "  make clean                Remove .next, out, build artefacts"
	@echo ""
	@echo "  Sync PROD <-> THIS (joinery-v2-prod):"
	@echo "  make sync-prod-status     Show what differs, plus prod's own config/git state"
	@echo "  make sync-to-prod-dry     Preview HERE -> PROD without touching anything"
	@echo "  make sync-to-prod         Mirror HERE -> PROD (dry-run + confirm)"
	@echo "  make sync-from-prod-dry   Preview PROD -> HERE without touching anything"
	@echo "  make sync-from-prod       Mirror PROD -> HERE (dry-run + confirm)"
	@echo ""
	@echo "  Sync an arbitrary PEER checkout:"
	@echo "  make sync-to-peer PEER_DIR=/path     Mirror HERE -> PEER"
	@echo "  make sync-from-peer PEER_DIR=/path   Mirror PEER -> HERE"
	@echo ""
	@echo "  Sync mirrors: files deleted on the source side are deleted on the"
	@echo "  target side. wrangler.toml, .env and .git are never synced."

install:
	npm ci

dev:
	npm run dev

# No functions/ directory in this project, so there are no Pages Functions to run.
# This still serves the real static export through the Workers runtime, which is
# useful for verifying redirects, headers, and the deployed artefact locally.
dev-functions: build
	npx wrangler pages dev

build:
	npm run build

# `build` honours .env, which pins NEXT_PUBLIC_SITE_URL to localhost for local work —
# that export is intentionally noindex. Anything bound for joinery.ae goes through
# build-prod, which overrides the site URL, and verify-prod, which checks the result.
build-prod:
	npm run build:prod

verify-prod:
	npm run verify:prod

start:
	npm run start

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

# Keyword Planner credentials stay local in keywords_planner/.env. Copy the
# included .env.example, fill it from the approved Google Ads account, then run
# `make keywords`. The output is timestamped and intentionally ignored by git.
$(KEYWORDS_PYTHON):
	python3 -m venv $(KEYWORDS_VENV)
	$(KEYWORDS_VENV)/bin/pip install -r keywords_planner/requirements.txt

keywords-install: $(KEYWORDS_PYTHON)

keywords: $(KEYWORDS_PYTHON)
	$(KEYWORDS_PYTHON) keywords_planner/keywords_research.py

# `assets` deliberately excludes assets-posters: package.json declares
# "assets:posters": "node scripts/make-posters.mjs" but that script does not
# exist in scripts/. Add the script, then append assets-posters here.
assets: assets-images

assets-images:
	npm run assets:images

assets-images-prune:
	npm run assets:images:prune

assets-posters:
	npm run assets:posters

assets-og:
	npm run assets:og

# pages:deploy = build:prod -> verify:prod -> wrangler. The verify step fails the
# deploy rather than shipping a noindex or localhost-canonical export to joinery.ae.
deploy:
	npm run pages:deploy

tail:
	npx wrangler pages deployment tail --project-name=$(PAGES_PROJECT)

clean:
	rm -rf .next out tsconfig.tsbuildinfo

# ==============================================================================
# SYNC BETWEEN CHECKOUTS OF THIS PROJECT
# ==============================================================================
#
# PROD_DIR is joinery-v2-prod: the same "joinery-ae" package as this tree, with
# its own git remote (halogroupsa/joinery-v2-prod, separate from this checkout's
# Admin-DesignsFrontier/joinery-v2-staging).
#
# These targets MIRROR: a file deleted here is deleted on the target too, so the
# two trees stay identical rather than prod accumulating stale routes and images.
# Every target dry-runs first and lists deletions before asking to proceed.
#
# Never synced in either direction — each checkout owns its own copy:
#
#   wrangler.toml   Cloudflare Pages project name and build output config
#   .env            NEXT_PUBLIC_SITE_URL, GTM / Google Ads IDs
#   .git            the two checkouts track different remotes
#
# plus build artefacts and local-only state (.next, out, node_modules,
# .wrangler, graphify-out, .venv-keywords, *_keywords.json, tsbuildinfo).
#
# joinery-v2-prod therefore keeps its own wrangler.toml, naming the "joinery-ae"
# Pages project. It needs no .env: src/lib/site.ts falls back to CANONICAL_URL
# when NEXT_PUBLIC_SITE_URL is unset, so a prod checkout without one builds
# canonical on https://joinery.ae and indexable — the opposite of this staging
# tree, whose .env pins localhost and yields a noindex export. Add a .env in prod
# only to supply NEXT_PUBLIC_GTM_ID / NEXT_PUBLIC_GOOGLE_ADS_ID.
# `make sync-prod-status` reports the state of both files.
#
# Do NOT point any of these at joinery-prod. That directory is a Vite/React app
# ("vite_react_shadcn_ts"), not a counterpart of this project, and mirroring onto
# it would destroy it. scripts/sync-tree.sh refuses a destination whose
# package.json name differs from this one's, so that is enforced rather than just
# documented here.
#
# The copy/prune split, and why this is not a plain `rsync -a --delete`, is
# explained at the top of scripts/sync-tree.sh: macOS ships openrsync, which
# deletes --excluded paths in the destination (it would wipe prod's .git,
# wrangler.toml and .env) and which ignores --exclude entirely once any --filter
# is present.

THIS_DIR := $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
SYNC := $(THIS_DIR)/scripts/sync-tree.sh

PROD_DIR ?= /Volumes/MacLexarSsd/Lexar_Documents/DesignsFrontier/halo_ae/joinery-v2-prod
PEER_DIR ?=

# Dry-run, show the copy and delete lists, then apply only on an explicit yes.
define sync_confirm
	@$(SYNC) "$(1)" "$(2)"
	@echo ""
	@read -p "Apply these changes? [y/N]: " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		$(SYNC) "$(1)" "$(2)" --apply; \
	else \
		echo "Cancelled"; \
	fi
endef

# Refuse to run the peer targets unless PEER_DIR was passed.
define require_peer
	@if [ -z "$(PEER_DIR)" ]; then \
		echo "❌ PEER_DIR is not set. Pass it explicitly:"; \
		echo "   make $@ PEER_DIR=/path/to/counterpart"; \
		echo "   (for joinery-v2-prod use make sync-to-prod / sync-from-prod)"; \
		echo "   (do NOT use joinery-prod — different stack, see above)"; \
		exit 1; \
	fi
endef

# ---- prod ---------------------------------------------------------------------

sync-to-prod-dry:
	@$(SYNC) "$(THIS_DIR)" "$(PROD_DIR)"

sync-from-prod-dry:
	@$(SYNC) "$(PROD_DIR)" "$(THIS_DIR)"

sync-to-prod:
	$(call sync_confirm,$(THIS_DIR),$(PROD_DIR))

sync-from-prod:
	$(call sync_confirm,$(PROD_DIR),$(THIS_DIR))

# Prod's deploy config and git state are outside the sync, so check them here.
sync-prod-status:
	@echo "PROD_DIR: $(PROD_DIR)"
	@if [ ! -d "$(PROD_DIR)" ]; then echo "  ❌ does not exist"; exit 1; fi
	@if [ -f "$(PROD_DIR)/wrangler.toml" ]; then \
		echo "  ✅ wrangler.toml — Pages project \"$$(sed -n 's/^name[[:space:]]*=[[:space:]]*"\(.*\)"/\1/p' "$(PROD_DIR)/wrangler.toml")\""; \
	else \
		echo "  ❌ wrangler.toml MISSING — wrangler cannot deploy without it"; \
	fi
	@if [ -f "$(PROD_DIR)/.env" ]; then \
		echo "  ✅ .env — SITE_URL: $$(sed -n 's/^NEXT_PUBLIC_SITE_URL=//p' "$(PROD_DIR)/.env")"; \
	else \
		echo "  ·  .env absent — this is fine, and is the safer default:"; \
		echo "     src/lib/site.ts falls back to CANONICAL_URL when"; \
		echo "     NEXT_PUBLIC_SITE_URL is unset, so even a bare 'make build' in"; \
		echo "     prod is canonical on https://joinery.ae and indexable."; \
		echo "     Add a .env only to set NEXT_PUBLIC_GTM_ID / _GOOGLE_ADS_ID."; \
	fi
	@if git -C "$(PROD_DIR)" rev-parse --verify HEAD >/dev/null 2>&1; then \
		echo "  git: $$(git -C "$(PROD_DIR)" rev-parse --abbrev-ref HEAD), $$(git -C "$(PROD_DIR)" rev-list --count HEAD) commit(s)"; \
	else \
		echo "  git: $$(git -C "$(PROD_DIR)" branch --show-current) — no commits yet"; \
	fi
	@git -C "$(PROD_DIR)" remote get-url origin 2>/dev/null | sed 's/^/  remote: /' || true
	@echo ""
	@$(SYNC) "$(THIS_DIR)" "$(PROD_DIR)"

# ---- arbitrary peer checkout --------------------------------------------------

sync-to-peer:
	$(require_peer)
	$(call sync_confirm,$(THIS_DIR),$(PEER_DIR))

sync-from-peer:
	$(require_peer)
	$(call sync_confirm,$(PEER_DIR),$(THIS_DIR))
