## Comanda Fácil — Front-end

Interface web do sistema **Comanda Fácil**, desenvolvido para auxiliar no gerenciamento de produtos e pedidos de uma lanchonete.

O front-end permite interagir com a API REST desenvolvida em Python com Flask, possibilitando o gerenciamento de produtos, criação de pedidos e acompanhamento dos seus status.

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- API REST
- Flask (backend)

---

## Funcionalidades

- Visualização dos produtos cadastrados
- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Adição de produtos à comanda
- Remoção de itens da comanda
- Cálculo automático do total
- Criação de pedidos
- Visualização dos pedidos
- Alteração do status dos pedidos

---

## Estrutura do projeto

```text
frontend/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Como executar

### 1. Inicie a API

O front-end depende da API Flask para funcionar.

Na pasta do projeto da API, execute:

```powershell
python backend/app.py
```

A API ficará disponível em:

```text
http://127.0.0.1:5000
```

### 2. Abra o front-end

Abra diretamente o arquivo:

```text
index.html
```

no navegador.

Não é necessário utilizar Live Server ou outro servidor para executar o front-end.

---

## Comunicação com a API

O JavaScript realiza requisições HTTP para a API Flask.

Principais rotas utilizadas:

| Método | Endpoint | Função |
|---|---|---|
| GET | `/api/produtos` | Lista produtos |
| POST | `/api/produtos` | Cadastra produto |
| PUT | `/api/produtos/<id>` | Edita produto |
| DELETE | `/api/produtos/<id>` | Exclui produto |
| POST | `/api/pedidos` | Cria pedido |
| GET | `/api/pedidos` | Lista pedidos |
| PUT | `/api/pedidos/<id>/status` | Atualiza status |

---

## Funcionamento

O usuário interage com a interface através dos produtos, da comanda e da área de pedidos.

As ações realizadas no front-end enviam requisições para a API, que processa os dados e realiza a comunicação com o banco de dados SQLite.

```text
Usuário
   ↓
Front-end
HTML + CSS + JavaScript
   ↓
API REST
Flask
   ↓
Banco de dados SQLite
```

---

## Status dos pedidos

Os pedidos podem apresentar os seguintes status:

- Pendente
- Em preparação
- Pronto
- Finalizado

---

## Projeto acadêmico

Projeto desenvolvido para a disciplina de **Desenvolvimento Full Stack Básico**.

**Comanda Fácil — MVP de gerenciamento de pedidos para lanchonetes.**