PROJECT_DIR := $(shell pwd)
TMP_BUILD   := /tmp/skoolbay-build

.PHONY: start stop restart logs build rebuild reset status

# Inicia os containers (sem rebuild)
start:
	docker compose up -d
	@echo "App disponível em http://localhost:3002"

# Para os containers
stop:
	docker compose down

# Reinicia sem rebuild
restart:
	docker compose restart

# Logs em tempo real
logs:
	docker compose logs -f

# Logs só da app
logs-app:
	docker compose logs -f app

# Build fora do OneDrive (evita lentidão do scan)
build:
	@echo "A copiar ficheiros para /tmp para evitar lentidão do OneDrive..."
	@rsync -a --delete \
		--exclude='.git' \
		--exclude='.next' \
		--exclude='node_modules' \
		--exclude='.env*' \
		"$(PROJECT_DIR)/" "$(TMP_BUILD)/"
	@cp "$(PROJECT_DIR)/.env" "$(TMP_BUILD)/.env"
	@echo "A construir imagem Docker..."
	@cd "$(TMP_BUILD)" && docker compose build
	@echo "Build concluído. Usa 'make start' para iniciar."

# Rebuild completo e reinicia
rebuild: build start

# Reset completo da base de dados
reset:
	docker compose down -v
	docker compose up -d
	@echo "Base de dados reiniciada."

# Estado dos containers
status:
	docker compose ps
