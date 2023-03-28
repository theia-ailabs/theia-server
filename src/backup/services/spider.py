import requests
from bs4 import BeautifulSoup

r = requests.get(
    'https://www.fotocasa.es/es/alquiler/viviendas/cornella-de-llobregat/todas-las-zonas/l')
soup = BeautifulSoup(r.text, 'lxml')

# print(r.text)

print(soup)
