from xml.dom.minidom import parse

dom = parse("parsers/imobiliaria.xml")

imobiliaria = dom.documentElement

imoveis = imobiliaria.getElementsByTagName('imovel')

id_imovel = 0

for imovel in imoveis:
    id_imovel += 1
    elemento_descricao = imovel.getElementsByTagName('descricao')[0]
    descricao = elemento_descricao.firstChild.nodeValue
    print(f"Imóvel {id_imovel}: {descricao}")

id_lido = int(input("Digite o ID do imóvel para ver mais detalhes: "))
imovel = imoveis[id_lido - 1]
print("---\n")

elemento_descricao = imovel.getElementsByTagName('descricao')[0]
descricao = elemento_descricao.firstChild.nodeValue
elemento_proprietario = imovel.getElementsByTagName('proprietario')[0]

proprietario = elemento_proprietario.firstChild.nodeValue
elemento_nome = elemento_proprietario.getElementsByTagName('nome')[0]
nome = elemento_nome.firstChild.nodeValue
elemento_email = elemento_proprietario.getElementsByTagName('email')
email = elemento_email[0].firstChild.nodeValue if elemento_email else None
elemento_telefones = elemento_proprietario.getElementsByTagName('telefone')
telefones = [telefone.firstChild.nodeValue for telefone in elemento_telefones] if elemento_telefones else []

elemento_endereco = imovel.getElementsByTagName('endereco')[0]
endereco = elemento_endereco.firstChild.nodeValue
elemento_rua = elemento_endereco.getElementsByTagName('rua')[0]
rua = elemento_rua.firstChild.nodeValue
elemento_bairro = elemento_endereco.getElementsByTagName('bairro')[0]
bairro = elemento_bairro.firstChild.nodeValue
elemento_cidade = elemento_endereco.getElementsByTagName('cidade')[0]
cidade = elemento_cidade.firstChild.nodeValue
elemento_numero = elemento_endereco.getElementsByTagName('numero')
numero = elemento_numero[0].firstChild.nodeValue if elemento_numero else None

elemento_caracteristicas = imovel.getElementsByTagName('caracteristicas')[0]
caracteristicas = elemento_caracteristicas.firstChild.nodeValue
elemento_tamanho = elemento_caracteristicas.getElementsByTagName('tamanho')[0]
tamanho = elemento_tamanho.firstChild.nodeValue
elemento_numQuartos = elemento_caracteristicas.getElementsByTagName('numQuartos')[0]
num_quartos = elemento_numQuartos.firstChild.nodeValue
elemento_numBanheiros = elemento_caracteristicas.getElementsByTagName('numBanheiros')[0]
num_banheiros = elemento_numBanheiros.firstChild.nodeValue

elemento_valor = imovel.getElementsByTagName('valor')[0]
valor = elemento_valor.firstChild.nodeValue

print("Descrição:", descricao)
print("Proprietário(a):", nome)

if email:
    print("Email:", email)
else:
    print("Email: (nenhum informado)")

if telefones:
    print("Telefones:", ", ".join(telefones))
else:
    print("Telefones: (nenhum informado)")

print("---\n")
print("Endereço")
print("Rua:", rua)
print("Bairro:", bairro)
print("Cidade:", cidade)

if numero:
    print("Número:", numero)
else:
    print("Número: S/N")

print("---\n")
print("Características")
print("Tamanho:", f"{tamanho} m²")
print("Número de Quartos:", num_quartos)
print("Número de Banheiros:", num_banheiros)
print("Valor:", valor)