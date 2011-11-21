# Installs Homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.github.com/gist/323731)"

# Installs wget
brew install wget

# Changes to Downloads directory - OS X language should be currently English
cd ~/Downloads

# Downloads Setuptools' egg
wget http://pypi.python.org/packages/source/s/setuptools/setuptools-0.6c11-py2.7.egg

# Shells Setuptools' egg
sh setuptools-0.6c11-py2.7.egg

# Installs pip
easy_install pip

# Installs libjpg, imagemagick and all dependencies (for treating images)
brew install libjpg
brew install imagemagick

# Installs Django
pip install django

# Installs postgresql
brew install postgresql

# Installs psycopg2
pip install psycopg2

# Creates Database bixiguia
createdb bixiguia