Módulos do sistema
==================

Para que o PIL (módulo de gerenciamento de imagens do python) trabalhe com
imagens JPG, o módulo libjpg deve ser instalado no sistema.

No Mac OS X com o brew instalado::

    $ brew install libjpg

No Debian::

    # apt-get install libjpeg62 libjpeg62-dev zlib1g-dev

Pacotes python
==============

Os pacotes python necessários para a execução do Bixiguia estão listados no
arquivos ``requeriments.txt``, disponível na raíz do projeto.

Com o virtualenv do projeto ativado, os pacotes devem ser instalados com o
comando::

    $ pip install -r requeriments.txt
