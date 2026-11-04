# Identidade visual — Gracie Barra Jardim das Américas

Referência obrigatória: **Manual de Uso da Marca Gracie Barra (23/09/2025)**, 20 páginas. As páginas citadas abaixo são desse manual.

> **Status:** cores alinhadas ao manual. Tipografia provisória da mesma família (D-DIN, licença livre). **Tipografia e logotipos ainda NÃO estão em conformidade total**: dependem de arquivos oficiais que não temos (ver "Pendências"). Não declarar o site 100% conforme enquanto houver pendências.

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
| Títulos principais | AdihausDIN Regular Bold | D-DIN Condensed Bold (`font-display`) |
| Destaques | AdihausDIN Cn Bold | D-DIN Condensed Bold (`font-display`) |
| Subtítulos | AdihausDIN Medium | D-DIN Condensed (`font-display`) |
| Texto, botões, navegação | AdihausDIN (peso adequado) | D-DIN Regular/Bold/Italic (`font-sans`) |

**Status: AdiHaus DIN NÃO implementada.** Os arquivos licenciados não foram fornecidos, e cópias de sites não oficiais não podem ser usadas: a fonte é proprietária e o site redistribuiria o arquivo a cada visitante.

**Fonte provisória desde 19/10/2026: D-DIN** (mesma família DIN; Copyright 2017 Datto Inc., desenho de Charles Nix/Monotype).

- Licença: **SIL Open Font License 1.1**, que permite uso e embed em sites, inclusive comerciais. A licença e o FONTLOG ficam junto dos arquivos, como a OFL exige: `src/app/fonts/D-DIN-LICENSE-OFL.txt` e `D-DIN-FONTLOG.txt`.
- Origem: repositório [amcchord/datto-d-din](https://github.com/amcchord/datto-d-din) (Austin McChord, fundador da Datto), arquivos `.woff2` originais, assinatura conferida.
- Estilos instalados: D-DIN Regular, Italic e Bold; D-DIN Condensed Regular e Bold. Cobre todo o Latin-1 (todos os acentos do português).
- A D-DIN só tem pesos 400 e 700. Classes com 500/600/800 usam o peso real mais próximo; `font-synthesis: none` impede negrito ou itálico artificial.
- Antes (até 19/10/2026): Barlow e Barlow Condensed (Google Fonts).

### Como instalar quando os arquivos chegarem

1. Confirmar que a licença permite **uso web** (embed em site).
2. Colocar os arquivos `.woff2` em `src/app/fonts/` (ou `.otf`/`.ttf`, se forem os disponíveis) e remover os arquivos e textos de licença da D-DIN.
3. Em `src/app/layout.tsx`, trocar os `src` da D-DIN pelos da AdiHaus DIN, **mantendo as variáveis** `--font-body` e `--font-condensed`, e declarando só os pesos que existirem nos arquivos (sem pesos fictícios):

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
6. Conferir quebras de linha (a AdiHaus DIN tem largura diferente da D-DIN), principalmente no cabeçalho.

---

## 3. Logotipos (p. 8–10, 13, 14, 17–19)

| Local | O que é usado hoje | Origem | Situação |
|---|---|---|---|
| Favicon (`src/app/favicon.ico`, 16/32/48 px), `icon.png` (256 px) e imagem do link compartilhado (`opengraph-image.png`, 512 px) | **Selo dourado Escola Premium**, fundo transparente (pedido do cliente, 21/10/2026) | Gerados de `assets/marca/selo-escola-premium-2026-transparente.png`: o JPG do selo com o fundo preto recortado só nas bordas (o selo em si não foi alterado) | Pedir à franqueadora a versão oficial com transparência |
| `apple-icon.png` (180 px) | Selo dourado sobre fundo branco | O iOS não aceita transparência (pintaria de preto) | — |
| Antes (até 21/10/2026) | Escudo vermelho com identificação da escola (formato da p. 17) | Arquivos do cliente em `assets/marca/` (`…-sem-degrade.ico`, `logo-jda.pdf`) | Guardados para uso futuro |
| Cabeçalho, rodapé, menu mobile, painel | **Nome em texto** "Gracie Barra / Jardim das Américas" (a pedido do cliente), em uma cor só | Texto na fonte provisória | **Não é logotipo oficial.** Ver pendências |
| Escudo no cabeçalho | Removido a pedido do cliente (15/10/2026) | — | — |
| Cabeçalho (à esquerda do nome), topo da página inicial (antes do selo Premium, lado a lado) e rodapé | **Logo da escola** (identificação "Jiu-Jitsu & Defesa Pessoal · Jardim das Américas - Curitiba, PR"), a pedido do cliente (26/10/2026; cabeçalho e topo em 04/11/2026) | `src/assets/marca/logo-escola-jda.png` (768 px): o arquivo oficial enviado pelo cliente em 04/11/2026 (`assets/marca/logo-jda-oficial.png`, 1687 px), com a máscara de transparência original, sobre um disco branco do tamanho do círculo do logo (o anel do texto é transparente com letras pretas, feito para fundo claro). O logo em si não foi alterado | Validar com a franqueadora (p. 17) junto com o arquivo oficial |
| Topo da Home e rodapé | **Selo "Escola Premium · Certificação 2026"** (`PremiumSeal.tsx`) | JPG 1280 px enviado pelo cliente em 19/10/2026 (original em `assets/marca/selo-escola-premium-2026.jpg`), sem edição | Usado só sobre fundo preto: o JPG não tem transparência (cantos pretos). Pedir versão PNG/SVG com fundo transparente para usar em fundos claros |

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
