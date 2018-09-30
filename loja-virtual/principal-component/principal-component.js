const REAL = value => currency(value, { precision: 2, symbol: 'R$ ', decimal: ',', separator: '.' });
var carrinho = new Array();

$(document).ready(function () {
    //Futuramente inicializar todo conteúdo do html aqui
});

function adicionaProdutoAoCarrinho(produtoId) {

    //Verifica se o id do produto já existe no carrinho
    if (carrinho.includes(produtoId)) {
        //Caso exista, não efetua nenhum procedimento
        return;
    }

    //Armazena no carrinho o id do produto
    carrinho.push(produtoId);

    //Busca informações do produto a serem listados na tabela
    var descricao = $(`#produtoDescricao${produtoId}`).text();
    var informacoes = $(`#produtoInformacao${produtoId}`).text();
    var valorUnitario = $(`#produtoValor${produtoId}`).text();
    var valorTotal = valorUnitario;
    var urlImagem = $(`#produtoImagem${produtoId}`).attr('src');
    var imagem = $(`<img class="produto-imagem" src="${urlImagem}" />`)[0].outerHTML;

    //Removo a tr (linha) mostrando que o carrinho não está vazio
    $(`#carrinhoVazio`).remove();

    //Indexa tr (linha) do produto à tabela
    $("#carrinho > tbody").append(`
        <tr id="produto${produtoId}">
            <th>
                <div>${imagem} ${descricao}</div>
                <small>${informacoes}</small>
            </th>
            <td>
                <input id="produtoQuantidade${produtoId}" class="form-control form-control-sm" value="1" type="number" min="1" oninput="calculaValorTotalProduto(${produtoId})">
            </td>
            <td class="alinhamento-numerico">${valorUnitario}</td>
            <td class="alinhamento-numerico" id="produtoValorTotal${produtoId}">${valorTotal}</td>
            <td class="alinhamento-acao">
                <button class="btn btn-danger" onclick="removeProdutoDoCarrinho(${produtoId})"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
    `);

    //Altera o valor total da compra
    $("#valorTotalCompra").text(calculaValorTotalCompra());
}

function calculaValorTotalProduto(produtoId) {

    //Busca a quantidade digitada à ser calculada pelo preço total
    var quantidade = $(`#produtoQuantidade${produtoId}`).val();

    //Verifico se a quantidade digitada é nula ou <= a 0
    if (!quantidade || quantidade <= 0) {
        //Caso for, atribuo ao elemento input o valor 1
        $(`#produtoQuantidade${produtoId}`).val(1);
        //E a quantidade digitada, o valor 1
        quantidade = 1;
    }

    //Busca o valor unitiário do produto à ser calculado pela quantidade
    var valorUnitario = $(`#produtoValor${produtoId}`).text();

    //Aplica Regexr para se utilizar uma expressão regular ao calcular o valor total
    valorUnitario = parseFloat(valorUnitario.replace(/[^0-9-,]+/g, ''));
    quantidade = parseFloat(quantidade);

    //Formata o valor total para moeda brasileira (real)
    var valorTotal = REAL(currency(valorUnitario).multiply(quantidade)).format(true);

    //Altero o valor total do produto
    $(`#produtoValorTotal${produtoId}`).text(valorTotal);

    //Altera o valor total da compra
    $("#valorTotalCompra").text(calculaValorTotalCompra());
}

function removeProdutoDoCarrinho(produtoId) {

    //Confirmação de remoção
    swal({
        title: "Você tem certeza que deseja remover o produto?",
        icon: "warning",
        buttons: {
            cancel: "Cancelar",
            catch: {
                text: "Remover",
                value: "catch",
            }
        },
        dangerMode: true,
    }).then((deletar) => {
        if (deletar) {
            //Remove o id do produto do carrinho
            carrinho.splice($.inArray(produtoId, carrinho), 1);

            //Remove da tabela a tr (linha) do produto
            $(`#produto${produtoId}`).remove();

            //Limpa o conteúdo da tabela
            limpaConteudoTabela();
        }
    });
}

function calculaValorTotalCompra() {
    var valorTotal = 0;

    //Varre a lista de carrinhos e calcula o valor total da compra
    $.each(carrinho, function (index, produtoId) {

        var produtoValorTotal = $(`#produtoValorTotal${produtoId}`).text();
        var valorFormatado = parseFloat(produtoValorTotal.replace(/[^0-9-,]+/g, ''));

        valorTotal += valorFormatado;
    });

    //Formata o valor total para moeda brasileira (real) e o retorna
    return REAL(valorTotal).format(true);
}

function finalizaCompra() {

    //Verifica se há produtos no carrinho
    if (carrinho.length == 0) {
        swal({
            title: "Erro!",
            text: "Adicione produtos no carrinho para efetuar uma compra.",
            icon: "error",
        });
    } else {
        //Finalização de compra
        swal({
            title: "Parabéns!",
            text: "Compra realizada com sucesso.",
            icon: "success",
        }).then(() => {

            $.each(carrinho, function (index, produtoId) {
                $(`#produto${produtoId}`).remove();
            });

            //Inicializa carrinho
            carrinho = new Array();

            //Limpa o conteúdo da tabela
            limpaConteudoTabela();
        });
    }
}

function limpaConteudoTabela() {

    //Se carrinho está vazio, adiciona linha mostrando que o carrinho está vazio
    if (carrinho.length == 0 && $("#carrinhoVazio").text() == "") {
        $("#carrinho > tbody").append(`
            <tr>
                <td id="carrinhoVazio" colspan="5">Carrinho vazio</td>
            </tr>
        `);
    }

    //Altera o valor total da compra
    $("#valorTotalCompra").text(calculaValorTotalCompra());
}