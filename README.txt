Instalação do projeto no MAC OS X

1) Acessar o site http://www.github.com
2) Cadastrar-se ou utilizar login já existente
3) No Finder, abrir o aplicativo Terminal (Aplicativos -> Utilitários -> Terminal)
4) Caso já tenha o Git configurado no computador, vá para o próximo passo. Caso contrário:
	1. Acesse http://git-scm.com e faça o download da última versão do Git
	2. No Terminal, verifique por chaves SSH já existentes:
		cd ~/.ssh
	Caso já possua chaves:
		mkdir key_backup
		cp id_rsa* key_backup
		rm id_rsa*
	Caso tenha feito o backup das chaves, ou não possua nenhuma chave:
		ssh-keygen -t rsa -C “seu email”
		Aperte enter quando perguntado em qual arquivo salvar a chave
		Coloque uma senha e a confirme-a
5) No site do GitHub, vá até Account Settings, clique em “SSH Public Keys” e clique em “Add another public key”
6) No Terminal, abra o arquivo id_rsa.pub com um editor de texto (sugestão: No Finder, aperte Shift + Command + G e digite a pasta ~/.ssh para achar o arquivo)
7) Copie a chave do documento, sem deletar espaços ou novas linhas, e cole no site do GitHub no campo “Key”, clicando em “Add Key” para adicionar a chave
8) No Terminal, digite ssh -T git@github.com
9) Aperte enter. Provavelmente uma mensagem dirá que a autenticidade do host não pôde ser estabelecida. Responda yes.
10) Vá, no site do GitHub, até Account Settings -> Account Admin e copie o token dado a você
11) Finalmente, para configurar sua conexão, no Terminal, digite
	1. git config --global user.name “SeuPrimeiroNome SeuUltimoNome”
	2. git config --global user.email “Seu Email”
	3. git config --global github.user nomeDeUsuario
	4. git config --global github.token seuToken
12) No diretório do seu usuário (cd ~), execute o comando git clone git@github.com:Bixiguia/bixiguia.git
13) Rode o script install_macosx_en.sh caso o idioma de seu OS X seja o Inglês ou rode o script install_macosx_ptbr.sh caso o idioma de seu OS X seja o Português. Os dois scripts estão localizados na pasta bixiguia/scripts.