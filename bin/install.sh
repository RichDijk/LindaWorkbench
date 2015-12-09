
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  sudo apt-get update && \
  sudo apt-get -y upgrade && \
  sudo apt-get install -y build-essential && \
  sudo apt-get install -y software-properties-common && \
  sudo apt-get install -y byobu curl git htop man unzip vim wget && \
  sudo apt-get install -y default-jdk && \
  sudo apt-get install -y git && \
  sudo apt-get install -y idle-python3.4 && \
  sudo apt-get install -yq --no-install-recommends wget pwgen ca-certificates && \
  sudo rm -rf /var/lib/apt/lists/*

# Install Elasticsearch.
ES_PKG_NAME=elasticsearch-1.5.0

  cd / && \
  wget https://download.elasticsearch.org/elasticsearch/elasticsearch/$ES_PKG_NAME.tar.gz && \
  tar xvzf $ES_PKG_NAME.tar.gz && \
  rm -f $ES_PKG_NAME.tar.gz && \
  mv /$ES_PKG_NAME /elasticsearch


# Install MySQL
# add our user and group first to make sure their IDs get assigned consistently, regardless of whatever dependencies get added
DEBIAN_FRONTEND=noninteractive
sudo apt-get install -y mysql-server

sudo cp util/scripts/my.cnf /etc/mysql/conf.d/my.cnf
chmod 664 /etc/mysql/conf.d/my.cnf
sudo cp util/scripts/mysql-run.sh /usr/local/bin/mysql-run
sudo chmod +x /usr/local/bin/mysql-run

# Install OpenRDF
SESAME_VERSION=2.7.13
SESAME_DATA=/openrdf-data

sudo apt-get install -y wget

wget http://sourceforge.net/projects/sesame/files/Sesame%202/$SESAME_VERSION/openrdf-sesame-$SESAME_VERSION-sdk.tar.gz/download -O /tmp/sesame.tar.gz && tar xzf /tmp/sesame.tar.gz -C /opt && ln -s /opt/openrdf-sesame-$SESAME_VERSION /opt/sesame && rm /tmp/sesame.tar.gz

# Remove docs and examples
sudo rm -rf $CATALINA_BASE/webapps/docs && rm -rf $CATALINA_BASE/webapps/examples

TOMCAT_MAJOR_VERSION=7
TOMCAT_MINOR_VERSION=7.0.55
CATALINA_BASE=/tomcat

wget -q https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz
wget -qO- https://archive.apache.org/dist/tomcat/tomcat-${TOMCAT_MAJOR_VERSION}/v${TOMCAT_MINOR_VERSION}/bin/apache-tomcat-${TOMCAT_MINOR_VERSION}.tar.gz.md5 | md5sum -c - 
tar zxf apache-tomcat-*.tar.gz
rm apache-tomcat-*.tar.gz
mv apache-tomcat* ${CATALINA_BASE}

chmod +x *.sh

mkdir ${CATALINA_BASE}/webapps/openrdf-sesame && cd ${CATALINA_BASE}/webapps/openrdf-sesame && jar xf /opt/sesame/war/openrdf-sesame.war &&  mkdir ${CATALINA_BASE}/webapps/openrdf-workbench && cd ${CATALINA_BASE}/webapps/openrdf-workbench && jar xf /opt/sesame/war/openrdf-workbench.war

#COPY run.sh /run.sh

# Clone LinDA Workbench repository
mkdir /LinDA
git clone https://github.com/LinDA-tools/LindaWorkbench.git /LinDA/LinDAWorkbench

# Install Python.
# https://github.com/docker-library/python/issues/13
LANG=C.UTF-8

# Update package lists and install python3, python3-dev, pip-3.2
sudo apt-get install --no-install-recommends -y -q \
    python3 python3-dev libmysqlclient-dev \
    ca-certificates \
    && sudo rm -rf /var/lib/apt/lists/*
sudo apt-get install -y python3-setuptools


#apt-get update && apt-get install -y libmysqlclient15-dev
sudo apt-get install -y libxml2-dev libxslt1-dev python-dev
sudo apt-get install -y libjpeg-dev
easy_install3 pip

# install application requirements
pip3 install -r /LinDA/LinDAWorkbench/requirements.txt

# Clone transformation app
git clone https://github.com/LinDA-tools/transformation.git /LinDA/LinDAWorkbench/linda/transformation


# Python 3 fix
pip3 install pyelasticsearch && pip3 install elasticsearch==1.7.0
cp util/patches/qdmodels.py /LinDA/LinDAWorkbench/linda/query_designer/models.py 

# custom files
cp passwords.py /LinDA/LinDAWorkbench/linda/linda_app/passwords.py
cp util/patches/settings.py /LinDA/LinDAWorkbench/linda/linda_app/settings.py
cp util/patches/vocabularies /LinDA/LinDAWorkbench/linda/linda_app/static/vocabularies
cp util/patches/models.py /LinDA/LinDAWorkbench/linda/linda_app/models.py

/elasticsearch/bin/elasticsearch -d & \
	service mysql start && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py makemigrations && \
	mysql -u root -e "CREATE DATABASE linda CHARACTER SET utf8 COLLATE utf8_general_ci;" && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py migrate && \
	echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | python3 /LinDA/LinDAWorkbench/linda/manage.py shell && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py loaddata /LinDA/LinDAWorkbench/linda/linda_app/installer/data/vocabularies.json && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py loaddata /LinDA/LinDAWorkbench/linda/linda_app/installer/data/classes.json && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py loaddata /LinDA/LinDAWorkbench/linda/linda_app/installer/data/properties.json && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py loaddata /LinDA/LinDAWorkbench/linda/linda_app/installer/data/categories.json && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py loaddata /LinDA/LinDAWorkbench/linda/linda_app/installer/data/algorithms.json && \
	python3 /LinDA/LinDAWorkbench/linda/manage.py install_repositories

# setup log directories
mkdir /LinDA/logs

# RDF2Any
sudo apt-get install -y maven 
git clone https://github.com/LinDA-tools/RDF2Any.git /LinDA/RDF2Any
current_dir=$PWD
cd /LinDA/RDF2Any/linda
mvn clean install
cd "$current_dir"

# QueryBuilder
git clone https://github.com/LinDA-tools/QueryBuilder.git /LinDA/QueryBuilder
gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
\curl -sSL https://get.rvm.io | bash
source /usr/local/rvm/scripts/rvm
rvm install 2.0.0
rvm gemset create qbuilder
rvm use 2.0.0@qbuilder
gem install rails --no-ri --no-rdoc
gem install bundle
gem install bundler
cd /LinDA/QueryBuilder
bundle install
cd "$current_dir"

# LinDA Analytics
#################

# Install latest R
sudo sh -c 'echo "deb http://cran.rstudio.com/bin/linux/ubuntu trusty/" >> /etc/apt/sources.list'
gpg --keyserver keyserver.ubuntu.com --recv-key E084DAB9
gpg -a --export E084DAB9 | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install r-base

# Important additional libraries
sudo apt-get install -y libcurl4-gnutls-dev
sudo apt-get install libxml2-dev
sudo apt-get install -y libmime-base64-urlsafe-perl libdigest-hmac-perl libdigest-sha-perl
sudo apt-get install libssl-dev

# Analytics components
sh util/scripts/analytics.sh
