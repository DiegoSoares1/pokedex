# Pokédex

Uma aplicação web estática desenvolvida com HTML, CSS e JavaScript puro, que exibe Pokémon de todas as 9 gerações utilizando dados JSON locais. O site inclui funcionalidades de busca, filtros, controles de expansão/recolhimento de seções, alternância entre temas claro e escuro, e um modal para exibir cartas do Pokémon TCG obtidas via API oficial.

## Demonstração

Acesse a versão ao vivo do projeto hospedada no GitHub Pages: [Pokédex Demo](https://seu-usuario.github.io/pokedex)

*(Opcional: Insira aqui uma imagem ou GIF demonstrando o projeto em ação)*

## Funcionalidades

- 📋 Listagem completa de Pokémon das 9 gerações
- 🔍 Busca por nome ou número do Pokémon
- 🏷️ Filtros por tipo de Pokémon e geração
- 📂 Expansão/recolhimento das seções de gerações
- 🌙 Alternância entre temas claro e escuro
- 🎴 Modal de cartas do Pokémon TCG com cache persistente no localStorage
- 🧩 Estrutura modular do front-end para facilitar a manutenção

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e temas
- **JavaScript (ES6+)**: Lógica da aplicação e interatividade
- **Pokémon TCG API**: Para buscar e exibir cartas de TCG

## Como Rodar o Projeto Localmente

### Pré-requisitos
- Navegador web moderno
- Servidor local (recomendado para melhor experiência)

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/pokedex.git
   ```

2. **Navegue até a pasta do projeto**:
   ```bash
   cd pokedex
   ```

3. **Execute um servidor local**:
   - **Usando Live Server (VS Code)**: Instale a extensão Live Server e clique com o botão direito em `index.html` > "Open with Live Server".
   - **Usando Python**: Execute `python -m http.server 8000` e acesse `http://localhost:8000`.
   - **Usando Node.js**: Instale `http-server` globalmente (`npm install -g http-server`) e execute `http-server -p 8000`.

4. **Abra no navegador**: Acesse `http://localhost:8000` ou o link fornecido pelo servidor.

## Estrutura do Projeto

- `index.html` — Página principal estática
- `assets/css/` — Módulos CSS organizados:
  - `reset.css` — Reset de estilos
  - `variables.css` — Variáveis CSS
  - `base.css` — Estilos base
  - `layout.css` — Layout da página
  - `theme.css` — Temas (claro/escuro)
  - `components.css` — Componentes da UI
  - `modal.css` — Estilos do modal
  - `scrollbar.css` — Personalização da barra de rolagem
- `assets/js/` — JavaScript modular:
  - `app.js` — Lógica principal da aplicação
  - `components/` — Componentes da UI (ex.: cartão de Pokémon)
  - `services/` — Serviços de carregamento de dados e cache da API TCG
  - `utils/` — Utilitários auxiliares
- `data/` — Arquivos JSON locais das gerações
- `tools/translation/` — Scripts de tradução e geração (separados do front-end)

## Melhorias Futuras

- ⭐ Sistema de favoritos para Pokémon
- 📄 Paginação para melhor performance com grandes listas
- 🔄 Integração com PokéAPI para dados em tempo real
- 📱 Versão responsiva aprimorada para dispositivos móveis
- 🎮 Animações e transições mais fluidas
- 🌐 Suporte a múltiplos idiomas
- 💾 Cache offline com Service Workers (PWA)

## Autor

Desenvolvido por Diego Soares Santos (https://www.linkedin.com/in/diego-santos-b8643a15b/). Sinta-se à vontade para contribuir ou entrar em contato!
