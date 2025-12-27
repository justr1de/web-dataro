"""
Script para adicionar painéis Power BI dos municípios pendentes
Municípios: Chupinguaia, Cujubim, Rio Crespo, Vilhena
"""

from supabase import create_client, Client

# Configuração do Supabase
supabase_url = "https://csuzmlajnhfauxqgczmu.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzdXptbGFqbmhmYXV4cWdjem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzExMzcsImV4cCI6MjA4MTMwNzEzN30.eATRbvz2klesZnV3iGBk6sgrvZMbk_1YscW5oi9etfA"

supabase: Client = create_client(supabase_url, supabase_key)

def buscar_municipios():
    """Busca os IDs dos municípios pendentes"""
    municipios_nomes = ['Chupinguaia', 'Cujubim', 'Rio Crespo', 'Vilhena']
    
    print("\n" + "="*80)
    print("🔍 BUSCANDO IDs DOS MUNICÍPIOS PENDENTES")
    print("="*80 + "\n")
    
    municipios_ids = {}
    
    for nome in municipios_nomes:
        response = supabase.table('municipios').select('id, nome').ilike('nome', f'%{nome}%').execute()
        
        if response.data:
            municipio = response.data[0]
            municipios_ids[nome] = municipio['id']
            print(f"✅ {municipio['nome']:<20} | ID: {municipio['id']}")
        else:
            print(f"❌ {nome:<20} | NÃO ENCONTRADO")
    
    print("\n" + "="*80 + "\n")
    return municipios_ids

def adicionar_paineis(municipios_ids, urls_paineis):
    """Adiciona os painéis Power BI para os municípios"""
    print("📊 ADICIONANDO PAINÉIS POWER BI")
    print("="*80 + "\n")
    
    for municipio_nome, municipio_id in municipios_ids.items():
        if municipio_nome not in urls_paineis:
            print(f"⏭️  {municipio_nome}: Aguardando URL do painel")
            continue
        
        url_painel = urls_paineis[municipio_nome]
        
        painel_data = {
            'municipio_id': municipio_id,
            'titulo': f'Painel Econômico de {municipio_nome}',
            'descricao': f'Dados econômicos e sociais do município de {municipio_nome}',
            'url_powerbi': url_painel,
            'embed_url': url_painel,
            'status': 'ativo'
        }
        
        try:
            response = supabase.table('paineis_bi').insert(painel_data).execute()
            print(f"✅ {municipio_nome}: Painel adicionado com sucesso!")
        except Exception as e:
            print(f"❌ {municipio_nome}: Erro ao adicionar painel - {str(e)}")
    
    print("\n" + "="*80 + "\n")

def verificar_paineis_existentes(municipios_ids):
    """Verifica se já existem painéis para estes municípios"""
    print("🔍 VERIFICANDO PAINÉIS EXISTENTES")
    print("="*80 + "\n")
    
    for municipio_nome, municipio_id in municipios_ids.items():
        response = supabase.table('paineis_bi').select('*').eq('municipio_id', municipio_id).execute()
        
        if response.data:
            painel = response.data[0]
            print(f"⚠️  {municipio_nome}: JÁ POSSUI PAINEL")
            print(f"    Status: {painel['status']}")
            print(f"    URL: {painel.get('url_powerbi', 'Não definida')[:50]}...")
        else:
            print(f"✅ {municipio_nome}: Pronto para receber painel")
    
    print("\n" + "="*80 + "\n")

def main():
    print("\n" + "="*80)
    print("🚀 GERENCIADOR DE PAINÉIS POWER BI - MUNICÍPIOS PENDENTES")
    print("="*80 + "\n")
    
    # 1. Buscar IDs dos municípios
    municipios_ids = buscar_municipios()
    
    if not municipios_ids:
        print("❌ Nenhum município encontrado. Verifique os nomes no banco de dados.")
        return
    
    # 2. Verificar painéis existentes
    verificar_paineis_existentes(municipios_ids)
    
    # 3. URLs dos painéis (PREENCHER COM AS URLs FORNECIDAS)
    urls_paineis = {
        # 'Chupinguaia': 'https://app.powerbi.com/view?r=CODIGO_AQUI',
        # 'Cujubim': 'https://app.powerbi.com/view?r=CODIGO_AQUI',
        # 'Rio Crespo': 'https://app.powerbi.com/view?r=CODIGO_AQUI',
        # 'Vilhena': 'https://app.powerbi.com/view?r=CODIGO_AQUI',
    }
    
    print("📝 INSTRUÇÕES PARA ADICIONAR OS PAINÉIS:")
    print("="*80)
    print("\n1. Edite este arquivo e preencha o dicionário 'urls_paineis' com as URLs")
    print("   fornecidas pelo Bruno (formato: https://app.powerbi.com/view?r=CODIGO)")
    print("\n2. Descomente as linhas correspondentes aos municípios")
    print("\n3. Execute novamente este script: python scripts/adicionar_paineis_pendentes.py")
    print("\n" + "="*80 + "\n")
    
    if urls_paineis:
        opcao = input("🤔 Deseja adicionar os painéis agora? (s/n): ")
        if opcao.lower() == 's':
            adicionar_paineis(municipios_ids, urls_paineis)
            print("✅ Processo concluído!")
        else:
            print("⏸️  Operação cancelada.")
    else:
        print("ℹ️  Nenhuma URL configurada. Preencha as URLs e execute novamente.")

if __name__ == "__main__":
    main()
