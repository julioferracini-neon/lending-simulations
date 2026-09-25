#!/usr/bin/env bash
set -e

echo "🔄 Verificando sincronização com o template..."

# 1. Checa alterações locais não commitadas
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ Existem alterações locais não commitadas. Salve ou commite seu trabalho antes de sincronizar."
  exit 1
fi

# 2. Configura remote 'template' se não existir
TEMPLATE_REPO="https://github.com/julioferracini-neon/prototype-boilerplate.git"
if ! git remote | grep -q "^template$"; then
  echo "📡 Configurando remote 'template' para: $TEMPLATE_REPO"
  git remote add template "$TEMPLATE_REPO"
fi

# 3. Busca novidades do template
echo "📥 Baixando novidades do template..."
git fetch template

# 4. Atualiza exclusivamente o Core e o Design System
echo "📦 Atualizando pastas src/core/ e src/design-system/..."
git checkout template/main -- src/core src/design-system

# 5. Commita se houver alterações
if [ -n "$(git status --porcelain src/core src/design-system)" ]; then
  git add src/core src/design-system
  git commit -m "chore: sincronizar core e design system com o template"
  echo "✨ Core e Design System atualizados e commitados!"
else
  echo "ℹ️ O Core e o Design System já estão na versão mais recente."
fi

# 6. Validação de tipagem
echo "🧪 Executando checagem estática..."
npm run lint

echo "✅ Protótipo sincronizado com o template com sucesso!"
