# 📊 Guia: Adicionar Painéis Power BI - Municípios Pendentes

## 🎯 Municípios a Adicionar

Os seguintes municípios estão prontos para receber seus painéis Power BI:

1. **Chupinguaia**
2. **Cujubim**
3. **Rio Crespo**
4. **Vilhena**

---

## 📝 Passo a Passo

### 1️⃣ Obter os Códigos dos Painéis

Quando receber os painéis Power BI, eles virão em URLs como:
```
https://app.powerbi.com/view?r=eyJrIjoiNzY5NWUxNWEtNmFkMy00MzQzLTliODgtZmE3Y2I2NzVhYjEwIiwidCI6IjliZDQ3NzVkLTk5OWYtNGM4Ny1iM2NmLWJmZjA0YmI0YTFlNCJ9
```

### 2️⃣ Acessar o Supabase Dashboard

1. **URL:** https://supabase.com/dashboard
2. **Login:** contato@dataro-it.com.br
3. **Projeto:** `csuzmlajnhfauxqgczmu`

### 3️⃣ Abrir o SQL Editor

No menu lateral esquerdo → **SQL Editor** → **New query**

### 4️⃣ Verificar IDs dos Municípios

Cole e execute esta query primeiro:

```sql
SELECT 
    id,
    nome,
    prefeito,
    CASE 
        WHEN EXISTS (SELECT 1 FROM paineis_bi WHERE municipio_id = municipios.id)
        THEN '⚠️ JÁ TEM PAINEL'
        ELSE '✅ PRONTO'
    END as status_painel
FROM municipios
WHERE nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY nome;
```

**Resultado esperado:**
| id | nome | prefeito | status_painel |
|----|------|----------|---------------|
| X | Chupinguaia | ... | ✅ PRONTO |
| Y | Cujubim | ... | ✅ PRONTO |
| Z | Rio Crespo | ... | ✅ PRONTO |
| W | Vilhena | ... | ✅ PRONTO |

### 5️⃣ Adicionar os Painéis

Para cada município, **substitua `CODIGO_DO_PAINEL_AQUI`** pela URL completa do painel:

#### Chupinguaia
```sql
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Chupinguaia',
    'Dados econômicos e sociais do município de Chupinguaia',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'ativo'
FROM municipios
WHERE nome = 'Chupinguaia';
```

#### Cujubim
```sql
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Cujubim',
    'Dados econômicos e sociais do município de Cujubim',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'ativo'
FROM municipios
WHERE nome = 'Cujubim';
```

#### Rio Crespo
```sql
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Rio Crespo',
    'Dados econômicos e sociais do município de Rio Crespo',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'ativo'
FROM municipios
WHERE nome = 'Rio Crespo';
```

#### Vilhena
```sql
INSERT INTO paineis_bi (municipio_id, titulo, descricao, url_powerbi, embed_url, status)
SELECT 
    id,
    'Painel Econômico de Vilhena',
    'Dados econômicos e sociais do município de Vilhena',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'https://app.powerbi.com/view?r=CODIGO_DO_PAINEL_AQUI',
    'ativo'
FROM municipios
WHERE nome = 'Vilhena';
```

### 6️⃣ Verificar os Painéis Adicionados

Execute esta query para confirmar:

```sql
SELECT 
    m.nome as municipio,
    p.titulo,
    p.status,
    p.data_criacao,
    LEFT(p.url_powerbi, 60) as url_preview
FROM paineis_bi p
JOIN municipios m ON m.id = p.municipio_id
WHERE m.nome IN ('Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena')
ORDER BY m.nome;
```

---

## ✅ Checklist Final

- [ ] URLs dos 4 painéis obtidas
- [ ] Acesso ao Supabase Dashboard confirmado
- [ ] Query de verificação de IDs executada
- [ ] Painel de Chupinguaia adicionado
- [ ] Painel de Cujubim adicionado
- [ ] Painel de Rio Crespo adicionado
- [ ] Painel de Vilhena adicionado
- [ ] Verificação final executada
- [ ] Teste no site: https://www.dataro-it.com.br/paineis/dashboard

---

## 🎨 Como os Painéis Aparecem no Site

Os cards dos municípios no dashboard mostrarão:

**ANTES (sem painel):**
```
┌─────────────────────────┐
│ [Bandeira do Município] │
│                         │
│ Nome do Município       │
│ Status: Em breve        │
│ Prefeito: ...           │
│                         │
│ ⏳ Painel em breve      │
└─────────────────────────┘
```

**DEPOIS (com painel):**
```
┌─────────────────────────┐
│ [Bandeira do Município] │
│                         │
│ Nome do Município       │
│ Status: Disponível ✅   │
│ Prefeito: ...           │
│                         │
│ ✅ Painel disponível    │
│ 💰 Transferências       │
└─────────────────────────┘
(clicável - abre o painel)
```

---

## 📞 Suporte

Se houver algum problema durante o processo:
- **Email:** contato@dataro-it.com.br
- **Docs:** `POWER_BI_INTEGRATION.md`
- **Script SQL:** `scripts/adicionar_paineis_pendentes.sql`
