import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

def create_http_client() -> requests.Session:
    """
    Cria um "telefone" padronizado para o nosso sistema ligar para as APIs externas.
    Se o G-Click ou o Asaas derem uma pequena travada (erro 500, 502, etc.), 
    este cliente não quebra o nosso sistema de imediato. Ele vai tentar de novo 
    automaticamente até 3 vezes antes de desistir.
    """
    session = requests.Session()
    
    # Configura 3 tentativas automáticas com um pequeno intervalo de espera
    retries = Retry(
        total=3,
        backoff_factor=0.5, # Espera 0.5s, 1s, 2s entre as tentativas
        status_forcelist=[500, 502, 503, 504] # Só tenta de novo se for erro do servidor deles
    )
    
    adapter = HTTPAdapter(max_retries=retries)
    
    # Aplica essa regra de insistência para qualquer site que formos acessar (http e https)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    return session

# Instância global pronta para ser usada nos nossos arquivos de serviço
http_client = create_http_client()