import xml.etree.ElementTree as ET
import json

tree = ET.parse('parsers/imobiliaria.xml')
root = tree.getroot()

imoveis = []

for imovel in root.findall('imovel'):
    proprietario = imovel.find('proprietario')

    dados = {
        'descricao': imovel.find('descricao').text,
        'proprietario': {
            'nome': proprietario.find('nome').text,
            'telefones': [tel.text for tel in proprietario.findall('telefone')],
            'email': proprietario.find('email').text if proprietario.find('email') is not None else None
        },
        'endereco': {
            'rua': imovel.find('endereco/rua').text,
            'bairro': imovel.find('endereco/bairro').text,
            'cidade': imovel.find('endereco/cidade').text,
            'numero': imovel.find('endereco/numero').text if imovel.find('endereco/numero') is not None else None
        },
        'caracteristicas': {
            'tamanho': imovel.find('caracteristicas/tamanho').text,
            'numQuartos': imovel.find('caracteristicas/numQuartos').text,
            'numBanheiros': imovel.find('caracteristicas/numBanheiros').text
        },
        'valor': imovel.find('valor').text
    }
    imoveis.append(dados)

json_string = json.dumps(imoveis, indent=4, ensure_ascii=False)

with open('imobiliaria.json', 'w', encoding='utf-8') as f:
    f.write(json_string)

print("Conversão concluída. Arquivo 'imobiliaria.json' criado.")