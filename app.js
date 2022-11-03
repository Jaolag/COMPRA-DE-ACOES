
//classe despesa
class Despesa {
    constructor(data, cod, quantidade, valor_unitario, selec_oper, valor, corretagem, valor_taxa, total) {
        this.data = data
        this.cod = cod
        this.quantidade = quantidade
        this.valor_unitario = valor_unitario
        this.selec_oper = selec_oper
        this.valor = valor
        this.corretagem = corretagem
        this.valor_taxa = valor_taxa
        this.total = total
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }           
        }
        return true
    }
  }

//Classe Banco de Dados localStorage
class Bd {
    
    constructor(){
        let id = localStorage.getItem('id')

        if(id == null){
            localStorage.setItem('id', 0)
        }

    }

    getProximoId(){
        //id atualizado mais um
        let proximoId = localStorage.getItem('id')//null
        return parseInt(proximoId) + 1 
    }

    //metodo do banco de daos
    gravar(d){
        
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id',id)        
    }

    recuperarTodosRegistros(){

        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++){
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i)) 

            //verificar se existe a possibilidade de haver indices que foram pulados ou removidos
            //neste caso nós vamos pular esses indices
            if(despesa === null){
                continue
            }

            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = Array

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesasFiltradas)

        console.log(despesa)

        //data
        if(despesa.data != ''){
            console.log('Filtro de data')
            despesasFiltradas = despesasFiltradas.filter(d => d.data == despesa.data)
        }
        
        //cod.value
        if(despesa.cod != ''){
            console.log('filtro de codigo')
            despesasFiltradas = despesasFiltradas.filter(d => d.cod == despesa.cod)
        }

        //quantidade
        if(despesa.quantidade != ''){
            console.log('filtro de quantidade')
            despesasFiltradas = despesasFiltradas.filter(d => d.quantidade == despesa.quantidade)
        }

        //valor_unitario
        if(despesa.valor_unitario != ''){
            console.log('filtro de valor unitario')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor_unitario == despesa.valor_unitario)
        }

        //selec_oper
        if(despesa.selec_oper != ''){
            console.log('filtro de operação')
            despesasFiltradas = despesasFiltradas.filter(d => d.selec_oper == despesa.selec_oper)
        }
      
        return despesasFiltradas
    }

}

//instancia do banco de dados
let bd = new Bd()

  //Função para cadastrar compra e venda
function cadastrarDespesa() {
    
    let data = document.getElementById('data')
    let cod = document.getElementById('codigo')
    let quantidade = document.getElementById('quantidade').value
    let valor_unitario = document.getElementById('valor_unitario').value
    let operacao = document.getElementsByName('cv')
    let valor = quantidade * valor_unitario
    let valor_taxa = valor * 0.0003
    let corretagem = 2.5
    let cv = ''
    if (operacao[0].checked){
        cv = 'Compra'
        var total = valor + valor_taxa + 2.5
    }else{
        cv = 'Venda'
        var total = valor - valor_taxa + 2.5
    }  
    
    let selec_oper

    for (let a = 0; a < operacao.length; a++) {
        if (operacao[a].checked){
            selec_oper = operacao[a].value;
            break;
        }
    }

    //obejto instanciado
    let despesa = new Despesa(
        data.value,
        cod.value,
        quantidade,
        valor_unitario,
        selec_oper,
        valor,
        corretagem,
        valor_taxa,
        total
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Dados cadastrados com sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        //dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        data.value = ''
        cod.value = ''
        quantidade.value = ''
        valor_unitario.value = ''


    }else{

        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do dados'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação verifique se todos os dados foram preenchidos corretamente!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        
        //console.log('Dados invalidos')
        $('#modalRegistraDespesa').modal('show')

    }

}

function carregaListaDespesas(){

    let despesas = Array()

    despesas = bd.recuperarTodosRegistros()

    //selecionando o elemento tbody da tabela
    var listaDespesas = document.getElementById('listaDespesas')

    //percorrer o Array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as culnas (td)
        linha.insertCell(0).innerHTML = d.data
        linha.insertCell(1).innerHTML = d.cod
        linha.insertCell(2).innerHTML = d.quantidade
        linha.insertCell(3).innerHTML = d.valor_unitario
        linha.insertCell(4).innerHTML = d.selec_oper
        linha.insertCell(5).innerHTML = d.valor
        linha.insertCell(6).innerHTML = d.corretagem
        linha.insertCell(7).innerHTML = d.valor_taxa.toFixed(4)
        linha.insertCell(8).innerHTML = d.total.toFixed(2)
    })

}

function pesquisarDespesa() {
    let data = document.getElementById('data')
    let cod = document.getElementById('codigo')
    let quantidade = document.getElementById('quantidade').value
    let valor_unitario = document.getElementById('valor_unitario').value
    let operacao = document.getElementsByName('cv')
    let valor = quantidade * valor_unitario
    let valor_taxa = valor * 0.0003
    let corretagem = 2.5
    let cv = ''
    if (operacao[0].checked){
        cv = 'Compra'
        var total = valor + valor_taxa + 2.5
    }else{
        cv = 'Venda'
        var total = valor - valor_taxa + 2.5
    }  
    
    let selec_oper

    for (let a = 0; a < operacao.length; a++) {
        if (operacao[a].checked){
            selec_oper = operacao[a].value;
            break;
        }
    }

    let despesa = new Despesa(
        data.value, 
        cod.value,
        quantidade,
        valor_unitario,
        selec_oper,
        valor,
        corretagem,
        valor_taxa,
        total
    )

    let despesas = bd.pesquisar(despesa)

    let listaDespesas = document.getElementById('listaDespesas2')
    listaDespesas.innerHTML = ''
    //percorrer o Array despesas, listando cada despesa de forma dinâmica
    despesas.forEach(function(d){
        

        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as culnas (td)
        linha.insertCell(0).innerHTML = d.data
        linha.insertCell(1).innerHTML = d.cod
        linha.insertCell(2).innerHTML = d.quantidade
        linha.insertCell(3).innerHTML = d.valor_unitario
        linha.insertCell(4).innerHTML = d.selec_oper
        linha.insertCell(5).innerHTML = d.valor
        linha.insertCell(6).innerHTML = d.corretagem
        linha.insertCell(7).innerHTML = d.valor_taxa.toFixed(4)
        linha.insertCell(8).innerHTML = d.total.toFixed(2)
    })

}
