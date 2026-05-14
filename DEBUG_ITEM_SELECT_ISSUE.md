# Debug: Item não aparece no select de saída

## 🔍 Problema Identificado
Item código 00082 não aparece no select de itens para saída, mesmo existindo no sistema.

## 🛠️ Causa Raiz
O filtro estava mostrando apenas itens com `availableQuantity > 0`, mas itens inconsistentes podem ter:
- `availableQuantity = 0` (indisponível)
- `inUseQuantity > 0` (marcado como em uso)
- `totalQuantity > 0` (existe no sistema)

## ✅ Solução Implementada

### **1. Filtro Corrigido**
```typescript
// ANTES: Mostrava apenas itens disponíveis
const availableItems = items.filter((item) =>
  item.availableQuantity > 0 &&
  (item.code.toLowerCase().includes(itemSearch.toLowerCase()) || item.name.toLowerCase().includes(itemSearch.toLowerCase()))
);

// DEPOIS: Mostra todos os itens com quantidade total > 0
const availableItems = items.filter((item) =>
  item.totalQuantity > 0 &&
  (item.code.toLowerCase().includes(itemSearch.toLowerCase()) || item.name.toLowerCase().includes(itemSearch.toLowerCase()))
);
```

### **2. Validação Adicionada**
```typescript
// Verifica se o item tem quantidade disponível suficiente
if (item.availableQuantity <= 0) {
  toast({
    title: "Item indisponível",
    description: `O item ${item.code} não possui quantidade disponível em estoque.`,
    variant: "destructive"
  });
  return;
}

// Verifica se a quantidade solicitada não excede o disponível
if (selectedItemQuantity > item.availableQuantity) {
  toast({
    title: "Quantidade insuficiente",
    description: `A quantidade solicitada (${selectedItemQuantity}) excede o disponível (${item.availableQuantity}) para o item ${item.code}.`,
    variant: "destructive"
  });
  return;
}
```

## 🎯 Comportamento Atual

### **✅ Item Aparece no Select**
- Todos os itens com `totalQuantity > 0` aparecem no select
- Inclui itens inconsistentes (disponível=0, em uso>0)

### **⚠️ Validação na Adição**
- Se item tem `availableQuantity = 0`: Mostra erro "Item indisponível"
- Se quantidade solicitada > disponível: Mostra erro "Quantidade insuficiente"
- Impede adição de itens sem estoque disponível

### **🔧 Fluxo Recomendado**
1. **Item aparece no select** ✅
2. **Usuário tenta adicionar** → Erro se indisponível
3. **Usar "Corrigir Inconsistências"** → Corrige quantidades
4. **Tentar novamente** → Funciona normalmente

## 🧪 Como Testar

### **Teste 1: Item Inconsistente**
1. Item código 00082 deve aparecer no select
2. Tentar adicionar → Deve mostrar erro "Item indisponível"
3. Usar "Corrigir Inconsistências" na tela de Relatórios
4. Tentar adicionar novamente → Deve funcionar

### **Teste 2: Item Normal**
1. Item com quantidade disponível > 0
2. Deve aparecer no select
3. Deve permitir adição normalmente

## 📋 Benefícios

1. **👀 Visibilidade**: Todos os itens aparecem no select
2. **🛡️ Validação**: Impede operações inválidas
3. **🔧 Correção**: Função para corrigir inconsistências
4. **📊 Feedback**: Mensagens claras sobre problemas
5. **🎯 UX**: Usuário entende o que está acontecendo

## 🚀 Próximos Passos

1. **Teste o select** - Item 00082 deve aparecer
2. **Tente adicionar** - Deve mostrar erro se indisponível
3. **Use correção automática** - Corrige inconsistências
4. **Teste novamente** - Deve funcionar normalmente

Agora o item código 00082 deve aparecer no select, mas com validação adequada para evitar operações inválidas!


## 🔍 Problema Identificado
Item código 00082 não aparece no select de itens para saída, mesmo existindo no sistema.

## 🛠️ Causa Raiz
O filtro estava mostrando apenas itens com `availableQuantity > 0`, mas itens inconsistentes podem ter:
- `availableQuantity = 0` (indisponível)
- `inUseQuantity > 0` (marcado como em uso)
- `totalQuantity > 0` (existe no sistema)

## ✅ Solução Implementada

### **1. Filtro Corrigido**
```typescript
// ANTES: Mostrava apenas itens disponíveis
const availableItems = items.filter((item) =>
  item.availableQuantity > 0 &&
  (item.code.toLowerCase().includes(itemSearch.toLowerCase()) || item.name.toLowerCase().includes(itemSearch.toLowerCase()))
);

// DEPOIS: Mostra todos os itens com quantidade total > 0
const availableItems = items.filter((item) =>
  item.totalQuantity > 0 &&
  (item.code.toLowerCase().includes(itemSearch.toLowerCase()) || item.name.toLowerCase().includes(itemSearch.toLowerCase()))
);
```

### **2. Validação Adicionada**
```typescript
// Verifica se o item tem quantidade disponível suficiente
if (item.availableQuantity <= 0) {
  toast({
    title: "Item indisponível",
    description: `O item ${item.code} não possui quantidade disponível em estoque.`,
    variant: "destructive"
  });
  return;
}

// Verifica se a quantidade solicitada não excede o disponível
if (selectedItemQuantity > item.availableQuantity) {
  toast({
    title: "Quantidade insuficiente",
    description: `A quantidade solicitada (${selectedItemQuantity}) excede o disponível (${item.availableQuantity}) para o item ${item.code}.`,
    variant: "destructive"
  });
  return;
}
```

## 🎯 Comportamento Atual

### **✅ Item Aparece no Select**
- Todos os itens com `totalQuantity > 0` aparecem no select
- Inclui itens inconsistentes (disponível=0, em uso>0)

### **⚠️ Validação na Adição**
- Se item tem `availableQuantity = 0`: Mostra erro "Item indisponível"
- Se quantidade solicitada > disponível: Mostra erro "Quantidade insuficiente"
- Impede adição de itens sem estoque disponível

### **🔧 Fluxo Recomendado**
1. **Item aparece no select** ✅
2. **Usuário tenta adicionar** → Erro se indisponível
3. **Usar "Corrigir Inconsistências"** → Corrige quantidades
4. **Tentar novamente** → Funciona normalmente

## 🧪 Como Testar

### **Teste 1: Item Inconsistente**
1. Item código 00082 deve aparecer no select
2. Tentar adicionar → Deve mostrar erro "Item indisponível"
3. Usar "Corrigir Inconsistências" na tela de Relatórios
4. Tentar adicionar novamente → Deve funcionar

### **Teste 2: Item Normal**
1. Item com quantidade disponível > 0
2. Deve aparecer no select
3. Deve permitir adição normalmente

## 📋 Benefícios

1. **👀 Visibilidade**: Todos os itens aparecem no select
2. **🛡️ Validação**: Impede operações inválidas
3. **🔧 Correção**: Função para corrigir inconsistências
4. **📊 Feedback**: Mensagens claras sobre problemas
5. **🎯 UX**: Usuário entende o que está acontecendo

## 🚀 Próximos Passos

1. **Teste o select** - Item 00082 deve aparecer
2. **Tente adicionar** - Deve mostrar erro se indisponível
3. **Use correção automática** - Corrige inconsistências
4. **Teste novamente** - Deve funcionar normalmente

Agora o item código 00082 deve aparecer no select, mas com validação adequada para evitar operações inválidas!
