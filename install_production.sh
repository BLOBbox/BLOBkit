#!/bin/bash

SCRIPTNAME=`basename $0`
SERVERNAME="amazon"
SERVERFOLDER="/var/www/django/devcom/media"
SUBFOLDER="lib"

if [ $# -lt 1 ]
then
        echo -e "  Usage : $SCRIPTNAME <url_to_component>\n"
        echo -e "  For example: $SCRIPTNAME http://integration/releases_storage/BLOBBOX_WEBDEV-1.22.4.UI.5.tgz \n"
        exit $NOARGS
fi

ssh $SERVERNAME "cd $SERVERFOLDER && rm -rf $SUBFOLDER/doc"
ssh $SERVERNAME "cd $SERVERFOLDER && rm -rf $SUBFOLDER/samples"
ssh $SERVERNAME "cd $SERVERFOLDER && rm -rf $SUBFOLDER/resources"
ssh $SERVERNAME mkdir -p $SERVERFOLDER/$SUBFOLDER
wget $1
scp `basename $1` $SERVERNAME:$SERVERFOLDER/$SUBFOLDER/
ssh $SERVERNAME "cd $SERVERFOLDER/$SUBFOLDER && tar zxvf `basename $1`"
ssh $SERVERNAME rm $SERVERFOLDER/$SUBFOLDER/`basename $1`
rm `basename $1`
