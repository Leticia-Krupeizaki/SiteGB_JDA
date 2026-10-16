# Identidade visual — Gracie Barra Jardim das Américas

Referência obrigatória: **Manual de Uso da Marca Gracie Barra (23/09/2025)**, 20 páginas. As páginas citadas abaixo são desse manual.

> **Status:** cores alinhadas ao manual. **Tipografia e logotipos ainda NÃO estão em conformidade total**: dependem de arquivos oficiais que não temos (ver "Pendências"). Não declarar o site 100% conforme enquanto houver pendências.

---

## 1. Cores (p. 11–12)

Tokens em `src/app/globals.css` (bloco `@theme`). Use sempre as classes `gb-*`, nunca hex solto nos componentes.

| Token | Valor | Origem no manual | Uso no site |
|---|---|---|---|
| `gb-red` | `#E1251B` | Vermelho GB, RGB 225/37/27, Pantone 485 C | Botões primários, destaques, foco |
| `gb-blue` = `gb-navy` | `#11286D` | Pantone P 103-8 C, RGB 17/40/109 | Faixas e destaques secundários, links |
| `gb-black` = `gb-ink` | `#000000` | K 100% | Texto principal, fundos escuros |
| `gb-gray-65` = `gb-mute` | `#595959` | K 65% (aproximação digital) | Texto secundário |
| `gb-gray-45` | `#8C8C8C` | K 45% (aproximação digital) | Só elementos decorativos (contraste 3,4:1 sobre branco, insuficiente para texto) |
| `gb-white` | `#FFFFFF` | Branco | Fundos e texto sobre escuro |

**Derivados** (não constam do manual; calculados a partir das cores oficiais, só para estados e superfícies):

| Token | Valor | Cálculo | Uso |
|---|---|---|---|
| `gb-red-dark` | `#B91E16` | vermelho GB 82% + preto | hover de botão vermelho |
| `gb-navy-dark` | `#0E2057` | azul GB 80% + preto | hover de elementos azuis |
| `gb-line` | `#E2E2E2` | cinza K45 25% + branco | bordas e fundos claros |

**Antes → depois (16/10/2026):**

| Token | Antes | Depois |
|---|---|---|
| `gb-red` | `#D71921` | `#E1251B` |
| `gb-red-dark` | `#B0141B` | `#B91E16` |
| `gb-navy` | `#002F80` | `#11286D` |
| `gb-navy-dark` | `#00225C` | `#0E2057` |
| `gb-ink` | `#111111` | `#000000` |
| `gb-mute` | `#4A4F5A` | `#595959` |
| `gb-line` | `#E5E7EB` | `#E2E2E2` |

**Contraste (WCAG, calculado):**

| Combinação | Contraste | Resultado |
|---|---|---|
| Branco sobre `gb-red` (botões) / `gb-red` sobre branco | 4,69:1 | AA (folga pequena: o vermelho oficial é mais claro que o anterior) |
| Branco sobre `gb-red-dark` (hover) | 6,44:1 | AA |
| Branco sobre `gb-blue` / `gb-blue` sobre branco | 13,56:1 | AA |
| `gb-mute` sobre branco / sobre seção cinza | 7,00:1 / 6,04:1 | AA |
| `gb-line` sobre preto (rodapé) | 16,21:1 | AA |
| `gb-red` sobre seção cinza (`bg-gb-line/60`) | 4,04:1 | **Insuficiente para texto pequeno** → nesses fundos o texto vermelho usa `gb-red-dark` (5,55:1) |
| `gb-gray-45` sobre branco | 3,36:1 | Só decorativo |

Regra prática: texto vermelho sobre fundo cinza usa `text-gb-red-dark`.

**Textura de cimento queimado (p. 12):** faz parte da identidade, mas não foi aplicada (fora do escopo desta etapa).

### Cores fora da paleta, mantidas de propósito

| Onde | Cor | Motivo | Situação |
|---|---|---|---|
| Grade: turmas GBK, GB2, GBF (`src/data/schedule.ts`) | verde, roxo, rosa (Tailwind) | Diferenciar turmas (Contexto.md). GB1 e No-Gi já usam azul e cinza oficiais | **Pendente:** confirmar com o cliente/franqueadora |
| Botão flutuante do WhatsApp | `#1F8F4E` | Cor reconhecível do serviço externo, não é elemento da marca GB | Mantido |

---

## 2. Tipografia (p. 15–16)

O manual define **AdiHaus DIN** como **única fonte permitida**. Hierarquia indicada:

| Elemento | Fonte do manual | Hoje (provisório) |
|---|---|---|
| Títulos principais | AdihausDIN Regular Bold | Barlow Condensed (`font-display`) |
| Destaques | AdihausDIN Cn Bold | Barlow Condensed (`font-display`) |
| Subtítulos | AdihausDIN Medium | Barlow Condensed (`font-display`) |
| Texto, botões, navegação | AdihausDIN (peso adequado) | Barlow (`font-sans`) |

**Status: NÃO implementada.** Os arquivos não estão no projeto e não devem ser obtidos de sites não oficiais. A Barlow segue como fonte provisória (`src/app/layout.tsx`).

### Como instalar quando os arquivos chegarem

1. Confirmar que a licença permite **uso web** (embed em site).
2. Colocar os arquivos `.woff2` em `src/app/fonts/` (ou `.otf`/`.ttf`, se forem os disponíveis).
3. Em `src/app/layout.tsx`, trocar `Barlow`/`Barlow_Condensed` por `next/font/local`, **mantendo as variáveis** `--font-body` e `--font-condensed`, e declarando só os pesos que existirem nos arquivos (sem pesos fictícios):

   ```ts
   import localFont from 'next/font/local';

   const body = localFont({
     variable: '--font-body',
     display: 'swap',
     src: [
       { path: './fonts/AdihausDIN-Regular.woff2', weight: '400', style: 'normal' },
       { path: './fonts/AdihausDIN-Italic.woff2', weight: '400', style: 'italic' },
       { path: './fonts/AdihausDIN-Medium.woff2', weight: '500', style: 'normal' },
       { path: './fonts/AdihausDIN-Bold.woff2', weight: '700', style: 'normal' },
     ],
   });

   const condensed = localFont({
     variable: '--font-condensed',
     display: 'swap',
     src: [
       { path: './fonts/AdihausDINCn-Medium.woff2', weight: '500', style: 'normal' },
       { path: './fonts/AdihausDINCn-MediumItalic.woff2', weight: '500', style: 'italic' },
       { path: './fonts/AdihausDINCn-Bold.woff2', weight: '700', style: 'normal' },
       { path: './fonts/AdihausDINCn-Italic.woff2', weight: '400', style: 'italic' },
     ],
   });
   ```

4. Revisar onde há `font-extrabold` (800) e `font-semibold` (600): a AdiHaus DIN do manual não tem esses pesos; trocar por `font-bold` (700) e `font-medium` (500).
5. Aplicar a hierarquia acima: títulos principais em AdihausDIN Bold (não condensada), destaques em Cn Bold.
6. Conferir quebras de linha (a DIN tem largura diferente da Barlow), principalmente no cabeçalho.

---

## 3. Logotipos (p. 8–10, 13, 14, 17–19)

| Local | O que é usado hoje | Origem | Situação |
|---|---|---|---|
| Favicon (`src/app/favicon.ico`) | Escudo com identificação da escola (formato da p. 17) | Arquivo enviado pelo cliente (`assets/marca/…-sem-degrade.ico`) | **Não validado** como arquivo oficial |
| Ícones `src/app/icon.png` (256 px) e `apple-icon.png` (180 px, fundo branco com margem) | Mesmo escudo, só redimensionado | Gerados do arquivo do cliente, sem alterar o desenho | **Não validado** |
| Cabeçalho, rodapé, menu mobile, painel | **Nome em texto** "Gracie Barra / Jardim das Américas" (a pedido do cliente), em uma cor só | Texto na fonte provisória | **Não é logotipo oficial.** Ver pendências |
| Escudo no cabeçalho/rodapé | Removido a pedido do cliente (15/10/2026) | — | — |

Observações:

- O arquivo `.svg` enviado (`assets/marca/…-sem-degrade.svg`) **não é vetorial**: é um PNG de 1180 px embutido num SVG. O manual pede arquivos extraídos do `.AI` em curvas.
- O nome em texto saía com "Gracie" em preto e "Barra" em vermelho. Essa combinação **não está entre as permitidas** (p. 9–10 só mostram o nome inteiro em uma cor). Corrigido para uma cor só.
- Não foram criados nem redesenhados logotipos. Os originais em `assets/marca/` não foram alterados.

### Versões com restrição (não usar sem autorização)

- **Logo Barra:** só com aprovação por escrito da GB Jiu Jitsu (p. 13).
- **G - Legado:** só na área da ProShop (p. 13).
- **Shield Barra:** só com autorização (p. 17).

### Regras para qualquer uso futuro do escudo

Arquivo oficial vetorial; proporções, ângulos e estrutura intactos; elementos sempre brancos; fundo do escudo vermelho ou preto (p. 18); nada sobre a marca; sem sombras, efeitos ou inclinação; respeitar a área de proteção (p. 14); fundos de aplicação só os das p. 8–10 (vermelho, branco, cinza-escuro, azul). Imagens dos Mestres Carlos Gracie Sr. e Carlos Gracie Jr. só com autorização por escrito do franqueador (p. 19).

---

## 4. Pendências (pedir a `suporte@graciebarra.com` ou à franqueadora)

1. **Fontes AdiHaus DIN** em formato web (`.woff2`) com licença de uso web: Regular, Italic, Medium, Bold e Cn Medium, Cn Medium Italic, Cn Bold, Cn Italic.
2. **Logotipos oficiais em vetor** (extraídos do `.AI` em curvas): Escudo Vermelho, Linear e Verticalizada (p. 13). Com eles, o nome em texto do cabeçalho pode virar a marca secundária oficial, se o cliente quiser.
3. **Identificação da escola** (escudo com "Jiu-Jitsu & Defesa Pessoal / Jardim das Américas - Curitiba, PR", p. 17) em arquivo oficial, para validar o favicon e os ícones atuais.
4. **Cores das turmas** verde/roxo/rosa da grade: confirmar se podem ser usadas ou se a grade deve usar só a paleta oficial.
