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

# 4. Mescla atualizações do core e design system
echo "🔀 Mesclando atualizações..."
git merge template/main --allow-unrelated-histories -m "chore: sincronizar melhorias com prototype-boilerplate"

# 5. Validação de tipagem
echo "🧪 Executando checagem estática..."
npm run lint

echo "✅ Protótipo sincronizado com o template com sucesso!"
