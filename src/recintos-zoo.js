class RecintosZoo {

    constructor() {
        this.especies = [
            { nome: 'LEAO', tamanho: 3, bioma: 'savana', carnivoro: true },
            { nome: 'LEOPARDO', tamanho: 2, bioma: 'savana', carnivoro: true },
            { nome: 'CROCODILO', tamanho: 3, bioma: 'rio', carnivoro: true },
            { nome: 'MACACO', tamanho: 1, bioma: 'savana ou floresta', carnivoro: false },
            { nome: 'GAZELA', tamanho: 2, bioma: 'savana', carnivoro: false },
            { nome: 'HIPOPOTAMO', tamanho: 4, bioma: 'savana ou rio', carnivoro: false }
        ];

        this.recintos = [
            { numero: '1', bioma: 'savana', tamanhoTotal: 10, animaisExistentes: { qtde: 3, especie: 'MACACO' } },
            { numero: '2', bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: { qtde: 0, especie: '' } },
            { numero: '3', bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: { qtde: 1, especie: 'GAZELA' } },
            { numero: '4', bioma: 'rio', tamanhoTotal: 8, animaisExistentes: { qtde: 0, especie: '' } },
            { numero: '5', bioma: 'savana', tamanhoTotal: 9, animaisExistentes: { qtde: 1, especie: 'LEAO' } }
        ];
    }

    analisaRecintos(animal, quantidade) {
        //Animal válido?
        const especie = this.especies.find(e => e.nome === animal);
        if (!especie) {
            return { erro: 'Animal inválido' };
        }
        //Quantidade válida?
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }
        //Filtrar recintos viáveis e ordenar pelo número
        let recintosViaveis = this.recintos.filter(recinto => this.verificarRecintoViavel(recinto, especie, quantidade));
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        recintosViaveis = recintosViaveis.map(recinto => {
            const espacoOcupadoExistente = recinto.animaisExistentes.qtde * this.especies.find(e => e.nome === recinto.animaisExistentes.especie)?.tamanho || 0;
            const espacoOcupadoNovo = especie.tamanho * quantidade;
            const espacoExtra = (recinto.animaisExistentes.especie && recinto.animaisExistentes.especie !== especie.nome) ? 1 : 0;
            const espacoOcupadoTotal = espacoOcupadoExistente + espacoOcupadoNovo + espacoExtra;
            const espacoLivre = recinto.tamanhoTotal - espacoOcupadoTotal;

            return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
        });

        return { recintosViaveis };
    }
    //Vreificar bioma e compatibilidade
    verificarRecintoViavel(recinto, especie, quantidade) {
        const biomasAnimal = especie.bioma.split(' ou ');
        if (!biomasAnimal.some(bioma => recinto.bioma.includes(bioma))) {
            return false;
        }

        if (recinto.animaisExistentes.especie !== '' && especie.carnivoro) {
            return false;
        }

        //Carnívoros sozinhos
        const especieExistente = this.especies.find(e => e.nome === recinto.animaisExistentes.especie);
        if (especieExistente && ((especieExistente.carnivoro && !especie.carnivoro) || (!especieExistente.carnivoro && especie.carnivoro))) {
            return false;
        }

        const espacoNecessario = this.calcularEspacoOcupado(recinto, especie, quantidade);

        if (espacoNecessario > recinto.tamanhoTotal) {
            return false;
        }

        //Hipopótamo
        if (especie.nome === 'HIPOPOTAMO' && recinto.animaisExistentes.especie !== '' && recinto.bioma !== 'savana e rio') {
            return false;
        }

        return true;
    }
    //Calcular p/ ver se tem espaço p/ novos animais.
    calcularEspacoOcupado(recinto, especie, quantidade) {
        let espacoOcupadoExistente = 0;

        if (recinto.animaisExistentes.especie === especie.nome) {
            espacoOcupadoExistente = recinto.animaisExistentes.qtde * especie.tamanho;
        }

        let espacoOcupadoNovo = especie.tamanho * quantidade;

        return espacoOcupadoExistente + espacoOcupadoNovo;
    }
}

const zoo = new RecintosZoo();
const resultado = zoo.analisaRecintos('UNICORNIO', 1);
console.log(resultado); 
const resultado1 = zoo.analisaRecintos('MACACO', 2);
console.log(resultado1);
const resultValido = zoo.analisaRecintos('HIPOPOTAMO', 2);
console.log(resultValido);

export { RecintosZoo as RecintosZoo };
