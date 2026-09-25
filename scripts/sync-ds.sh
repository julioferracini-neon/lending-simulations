#!/usr/bin/env bash
set -e

echo "🎨 Sincronizando Design System com o template..."

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

# 4. Puxa exclusivamente a pasta de Design System
echo "📦 Atualizando pasta src/design-system/..."
git checkout template/main -- src/design-system

# 5. Commita se houver alterações
if [ -n "$(git status --porcelain src/design-system)" ]; then
  git add src/design-system
  git commit -m "chore(ds): sincronizar Design System com o template"
  echo "✨ Design System atualizado e commitado!"
else
  echo "ℹ️ O Design System já está na versão mais recente."
fi

# 6. Validação
echo "🧪 Executando checagem estática..."
npm run lint

echo "✅ Design System sincronizado com sucesso!"
