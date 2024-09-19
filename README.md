# Portfolio Web

## Descrição

O **Portfolio Web** é um projeto pessoal desenvolvido para apresentar o meu portfólio. O site é uma vitrine para projetos, informações pessoais e formas de contato, projetado com foco em um design responsivo e moderno. Ele utiliza técnicas de design web e práticas para proporcionar uma experiência de usuário fluida e intuitiva.

## Ferramentas e Tecnologias Utilizadas

- **HTML5**: Estruturação do conteúdo e layout do site.
- **CSS3**: Estilização do site, utilizando variáveis CSS para o modo claro e escuro e animações para a interação do usuário.
- **Bootstrap 5**: Framework CSS para criar uma interface responsiva e moderna com componentes pré-estilizados, como a navbar e o grid system.
- **JavaScript**: Manipulação do DOM e implementação de funcionalidades interativas, como a troca de temas entre claro e escuro e a animação dos botões.
- **Google Fonts**: Inclusão de fontes tipográficas como Montserrat e Roboto para uma aparência visual consistente e estilizada.
- **Sass**: Pré-processador CSS utilizado para uma melhor organização e manutenção do código CSS (caso utilize na prática).

## Funcionalidades

- **Navegação Sticky**: A navbar permanece fixa no topo da página enquanto o usuário rola o conteúdo.
- **Tema Claro e Escuro**: Alternância entre os modos claro e escuro, com armazenamento da preferência do usuário.
- **Animações e Transições**: Efeitos de hover em links e itens de projeto para uma interação mais dinâmica e atraente.
- **Layout Responsivo**: Adaptação do layout para diferentes tamanhos de tela e dispositivos.

## Estrutura de Arquivos

- `templates`: Diretório principal HTML, que inclui os arquivos com as estruturas básica do site.
- `static`: Diretório contendo arquivo CSS para estilização e responsividade do site, e imagens/ícones utilizados no site.
- `app.py`: Arquivo executável python, utilizado para rodar a API Flask.
- `requirements.txt`: Arquivo com as dependências necessárias para rodar o projeto.
- `.gitignore`: Arquivo de texto contendo quais arquivos ou pastas devem ser ignoradas no projeto.

## Instalação

Para visualizar o projeto localmente, siga estes passos:

1. Clone o repositório:
   ```bash
   git clone [URL do repositório]

2. Navegue até o diretório do projeto:
   ```bash
   cd [nome do diretório]

3. Com o Python já instalado na máquina execute o comando a seguir:
   ```bash
   python app.py
   ```
   
   Para utilização no Windows utilize:

   ```bash
   python.exe .\app.py\

Dessa forma, será feito o deploy da API Flask e através do http local presente no terminal de comando é possível acessar localmente as páginas do projeto.
