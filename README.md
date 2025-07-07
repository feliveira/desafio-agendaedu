# Teste AgendaEdu

Este projeto foi desenvolvido como desafio técnico da [AgendaEdu](https://www.agendaedu.com) com o objetivo de criar um TODO APP eficiente, performático e bem testado, seguindo as melhores práticas de desenvolvimento.

Os requisitos do desafio podem ser visualizados aqui: [Link do Repositório do Teste Técnico](https://github.com/agendaedu/desafio-react-native)

## Sobre o Projeto

O objetivo principal foi construir um aplicativo de TODO supondo um contexto escolar, para auxiliar professores no gerenciamento de observações sobre seus alunos.

## Tecnologias Utilizadas

- ⚛️ **React Native**
- 🟦 **TypeScript**
- 🧠 **Redux Toolkit**
- 🎨 **NativeWind**
- 🔀 **React Navigation**
- 📦 **JSON Server**
- 📈 **Sentry**

## Funcionalidades Implementadas

As funcionalidades podem ser visualizadas em formato de GIF [neste link](https://imgur.com/a/funcionalidades-app-para-auxiliar-professores-no-gerenciamento-de-observa-es-sobre-seus-alunos-RVGGHvs)

- **Criação, edição e exclusão de turmas**
- **Criação, edição e exclusão de alunos**
- **Paginação de listas**
- **Criação, edição e exclusão de observações**
- **Marcar observações como favoritas**
- **Acesso rápido a turmas e alunos via favoritos**

## Como Executar o Projeto

Siga os passos abaixo para configurar e rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <PASTA_DO_PROJETO>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3. **Siga o guia de configuração do Sentry [na seguinte página](https://sentry.io/welcome/)**

2. **Configure o .env**
    ```bash
        EXPO_PUBLIC_SENTRY_DSN=<DNS provida pelo Sentry>
        EXPO_PUBLIC_JSON_SERVER_IP=<Seu IPV4>
    ```

5.   **Inicie o JSON Server:**
    ```bash
        npm run db
    ```

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
        npm run start
    ```

## Notas Pessoais e Agradecimento

Este projeto foi uma grande oportunidade de aprendizado, especialmente por me permitir explorar tecnologias e práticas que ainda não havia colocado em prática, como a criação de scripts de CI.

O desenvolvimento deste projeto foi muito importante tanto para me mostrar o que já sou capaz de construir, quanto os pontos que preciso fortalecer para continuar crescendo como desenvolvedor. A parte de testes, em especial, foi desafiadora para mim e evidenciou a importância de dedicar mais tempo para me aprofundar nesse tema.

Sou muito grato pela oportunidade de ter participado deste desafio e por tudo que pude aprender ao longo do processo, independentemente do resultado final do processo seletivo.

---