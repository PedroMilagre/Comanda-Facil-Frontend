const API_URL = "http://127.0.0.1:5000/api";

let produtos = [];
let comanda = [];


// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener("DOMContentLoaded", () => {

    carregarProdutos();
    carregarPedidos();

    const btnAtualizarProdutos =
        document.getElementById("btn-atualizar-produtos");

    if (btnAtualizarProdutos) {
        btnAtualizarProdutos.addEventListener(
            "click",
            carregarProdutos
        );
    }

    const btnAtualizarPedidos =
        document.getElementById("btn-atualizar-pedidos");

    if (btnAtualizarPedidos) {
        btnAtualizarPedidos.addEventListener(
            "click",
            carregarPedidos
        );
    }

    const btnFinalizar =
        document.getElementById("btn-finalizar-pedido");

    if (btnFinalizar) {
        btnFinalizar.addEventListener(
            "click",
            criarPedido
        );
    }

    const formProduto =
        document.getElementById("form-produto");

    if (formProduto) {
        formProduto.addEventListener(
            "submit",
            cadastrarProduto
        );
    }

});


// =========================
// CADASTRAR PRODUTO
// =========================

async function cadastrarProduto(event) {

    event.preventDefault();

    const nome =
        document.getElementById("nome-produto").value;

    const descricao =
        document.getElementById("descricao-produto").value;

    const preco =
        document.getElementById("preco-produto").value;

    const categoria =
        document.getElementById("categoria-produto").value;


    const produto = {

        nome: nome,

        descricao: descricao,

        preco: Number(preco),

        categoria: categoria

    };


    try {

        const resposta = await fetch(
            `${API_URL}/produtos`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(produto)
            }
        );


        const resultado = await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Erro ao cadastrar produto."
            );

        }


        alert("Produto cadastrado com sucesso!");


        document
            .getElementById("form-produto")
            .reset();


        carregarProdutos();


    } catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}


// =========================
// PRODUTOS
// =========================

async function carregarProdutos() {

    try {

        const resposta = await fetch(
            `${API_URL}/produtos`
        );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os produtos."
            );

        }


        produtos = await resposta.json();


        mostrarProdutos();


    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar os produtos.");

    }

}


// =========================
// MOSTRAR PRODUTOS
// =========================

function mostrarProdutos() {

    const lista =
        document.getElementById("lista-produtos");


    if (!lista) {

        console.error(
            "Elemento #lista-produtos não foi encontrado no HTML."
        );

        return;

    }


    lista.innerHTML = "";


    if (produtos.length === 0) {

        lista.innerHTML = `
            <div class="estado-vazio">

                <span>🍔</span>

                <p>
                    Nenhum produto cadastrado.
                </p>

            </div>
        `;

        return;

    }


    produtos.forEach(produto => {

        const card =
            document.createElement("div");


        card.className = "produto-card";


        const disponibilidade =
            produto.disponivel
                ? "Disponível"
                : "Indisponível";


        const classeDisponibilidade =
            produto.disponivel
                ? "produto-disponivel"
                : "produto-indisponivel";


        card.innerHTML = `

            <div class="produto-info">

                <div class="produto-cabecalho">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <span class="${classeDisponibilidade}">
                        ${disponibilidade}
                    </span>

                </div>


                <p class="produto-descricao">

                    ${produto.descricao ||
                    "Sem descrição."}

                </p>


                <div class="produto-detalhes">

                    <span class="produto-categoria">

                        ${produto.categoria}

                    </span>


                    <strong class="produto-preco">

                        ${formatarMoeda(
                            produto.preco
                        )}

                    </strong>

                </div>

            </div>


            <div class="produto-acoes">

                <button
                    type="button"
                    onclick="adicionarProduto(${produto.id})"
                >
                    Adicionar à comanda
                </button>


                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarProduto(${produto.id})"
                >
                    Editar
                </button>


                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirProduto(${produto.id})"
                >
                    Excluir
                </button>

            </div>

        `;


        lista.appendChild(card);

    });

}


// =========================
// EDITAR PRODUTO
// =========================

async function editarProduto(produtoId) {

    const produto = produtos.find(
        produto => produto.id === produtoId
    );


    if (!produto) {
        return;
    }


    const nome = prompt(
        "Nome do produto:",
        produto.nome
    );


    if (nome === null) {
        return;
    }


    const descricao = prompt(
        "Descrição:",
        produto.descricao || ""
    );


    if (descricao === null) {
        return;
    }


    const preco = prompt(
        "Preço:",
        produto.preco
    );


    if (preco === null) {
        return;
    }


    const categoria = prompt(
        "Categoria:",
        produto.categoria
    );


    if (categoria === null) {
        return;
    }


    const dados = {

        nome: nome,

        descricao: descricao,

        preco: Number(preco),

        categoria: categoria,

        disponivel: produto.disponivel

    };


    try {

        const resposta = await fetch(
            `${API_URL}/produtos/${produtoId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dados)
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Erro ao editar produto."
            );

        }


        alert(
            "Produto atualizado com sucesso!"
        );


        carregarProdutos();


    } catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}


// =========================
// EXCLUIR PRODUTO
// =========================

async function excluirProduto(produtoId) {

    const produto = produtos.find(
        produto => produto.id === produtoId
    );


    if (!produto) {
        return;
    }


    const confirmar = confirm(
        `Tem certeza que deseja excluir "${produto.nome}"?`
    );


    if (!confirmar) {
        return;
    }


    try {

        const resposta = await fetch(
            `${API_URL}/produtos/${produtoId}`,
            {
                method: "DELETE"
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.erro ||
                "Erro ao excluir produto."
            );

        }


        alert(
            "Produto excluído com sucesso!"
        );


        carregarProdutos();


    } catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}


// =========================
// COMANDA
// =========================

function adicionarProduto(produtoId) {

    const produto = produtos.find(
        produto => produto.id === produtoId
    );


    if (!produto) {
        return;
    }


    const itemExistente = comanda.find(
        item => item.produto_id === produtoId
    );


    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        comanda.push({

            produto_id: produto.id,

            nome: produto.nome,

            preco: produto.preco,

            quantidade: 1

        });

    }


    mostrarComanda();

}


function removerProduto(produtoId) {

    const indice = comanda.findIndex(
        item => item.produto_id === produtoId
    );


    if (indice === -1) {
        return;
    }


    if (comanda[indice].quantidade > 1) {

        comanda[indice].quantidade--;

    } else {

        comanda.splice(indice, 1);

    }


    mostrarComanda();

}


function mostrarComanda() {

    const lista =
        document.getElementById(
            "lista-comanda"
        );


    const comandaVazia =
        document.getElementById(
            "comanda-vazia"
        );


    const botaoFinalizar =
        document.getElementById(
            "btn-finalizar-pedido"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    if (comanda.length === 0) {

        if (comandaVazia) {
            comandaVazia.style.display = "block";
        }

        if (botaoFinalizar) {
            botaoFinalizar.disabled = true;
        }

        atualizarTotal();

        return;

    }


    if (comandaVazia) {
        comandaVazia.style.display = "none";
    }


    if (botaoFinalizar) {
        botaoFinalizar.disabled = false;
    }


    comanda.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;


        const elemento =
            document.createElement("div");


        elemento.className =
            "item-comanda";


        elemento.innerHTML = `

            <div class="item-info">

                <h3>
                    ${item.nome}
                </h3>

                <p>

                    ${formatarMoeda(
                        item.preco
                    )}

                    × ${item.quantidade}

                </p>

            </div>


            <div class="item-acoes">

                <span class="quantidade">

                    ${formatarMoeda(subtotal)}

                </span>


                <button
                    class="btn-remover"
                    onclick="removerProduto(${item.produto_id})"
                >
                    −
                </button>

            </div>

        `;


        lista.appendChild(elemento);

    });


    atualizarTotal();

}


function atualizarTotal() {

    const total = comanda.reduce(

        (soma, item) =>

            soma +
            (item.preco * item.quantidade),

        0

    );


    const elementoTotal =
        document.getElementById(
            "total-comanda"
        );


    if (elementoTotal) {

        elementoTotal.textContent =
            formatarMoeda(total);

    }

}


// =========================
// CRIAR PEDIDO
// =========================

async function criarPedido() {

    if (comanda.length === 0) {

        alert(
            "Adicione pelo menos um produto à comanda."
        );

        return;

    }


    const dados = {

        itens: comanda.map(item => ({

            produto_id: item.produto_id,

            quantidade: item.quantidade

        }))

    };


    try {

        const resposta = await fetch(

            `${API_URL}/pedidos`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify(dados)

            }

        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(

                resultado.erro ||

                "Erro ao criar pedido."

            );

        }


        alert(

            `Comanda #${resultado.pedido_id} criada com sucesso!`

        );


        comanda = [];


        mostrarComanda();


        carregarPedidos();


    } catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}


// =========================
// PEDIDOS
// =========================

async function carregarPedidos() {

    try {

        const resposta = await fetch(
            `${API_URL}/pedidos`
        );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar os pedidos."
            );

        }


        const pedidos =
            await resposta.json();


        mostrarPedidos(pedidos);


    } catch (erro) {

        console.error(erro);

        alert("Erro ao carregar os pedidos.");

    }

}


function mostrarPedidos(pedidos) {

    const lista =
        document.getElementById(
            "lista-pedidos"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML = "";


    if (pedidos.length === 0) {

        lista.innerHTML = `

            <div class="estado-vazio">

                <span>🧾</span>

                <p>
                    Nenhuma comanda cadastrada.
                </p>

            </div>

        `;

        return;

    }


    pedidos.forEach(pedido => {

        const card =
            document.createElement("div");


        card.className =
            "pedido-card";


        const statusClasse =
            obterClasseStatus(
                pedido.status
            );


        let itensHTML = "";


        pedido.itens.forEach(item => {

            itensHTML += `

                <div class="pedido-item">

                    <span>

                        ${item.quantidade}x
                        ${item.produto}

                    </span>


                    <span>

                        ${formatarMoeda(

                            item.preco_unitario *
                            item.quantidade

                        )}

                    </span>

                </div>

            `;

        });


        card.innerHTML = `

            <div class="pedido-topo">

                <span class="pedido-id">

                    Comanda #${pedido.id}

                </span>


                <span
                    class="status ${statusClasse}"
                >

                    ${pedido.status}

                </span>

            </div>


            <div class="pedido-itens">

                ${itensHTML}

            </div>


            <div class="pedido-total">

                <span>
                    Total
                </span>


                <strong>

                    ${formatarMoeda(
                        pedido.total
                    )}

                </strong>

            </div>


            <div class="pedido-status">

                <label>
                    Alterar status:
                </label>


                <select
                    onchange="alterarStatusPedido(
                        ${pedido.id},
                        this.value
                    )"
                >

                    <option
                        value="Pendente"
                        ${
                            pedido.status === "Pendente"
                                ? "selected"
                                : ""
                        }
                    >
                        Pendente
                    </option>


                    <option
                        value="Em preparação"
                        ${
                            pedido.status === "Em preparação"
                                ? "selected"
                                : ""
                        }
                    >
                        Em preparação
                    </option>


                    <option
                        value="Pronto"
                        ${
                            pedido.status === "Pronto"
                                ? "selected"
                                : ""
                        }
                    >
                        Pronto
                    </option>


                    <option
                        value="Finalizado"
                        ${
                            pedido.status === "Finalizado"
                                ? "selected"
                                : ""
                        }
                    >
                        Finalizado
                    </option>

                </select>

            </div>

        `;


        lista.appendChild(card);

    });

}


// =========================
// ALTERAR STATUS DO PEDIDO
// =========================

async function alterarStatusPedido(
    pedidoId,
    novoStatus
) {

    try {

        const resposta = await fetch(

            `${API_URL}/pedidos/${pedidoId}/status`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    status: novoStatus

                })

            }

        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(

                resultado.erro ||

                "Erro ao alterar status."

            );

        }


        alert(

            `Comanda #${pedidoId} agora está "${novoStatus}".`

        );


        carregarPedidos();


    } catch (erro) {

        console.error(erro);

        alert(erro.message);

        carregarPedidos();

    }

}


// =========================
// STATUS
// =========================

function obterClasseStatus(status) {

    switch (status) {

        case "Pendente":

            return "status-pendente";


        case "Em preparação":

            return "status-preparando";


        case "Pronto":

            return "status-pronto";


        case "Finalizado":

            return "status-finalizado";


        default:

            return "";

    }

}


// =========================
// UTILITÁRIOS
// =========================

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(

        "pt-BR",

        {

            style: "currency",

            currency: "BRL"

        }

    );

}