#!/bin/bash

invalidArguments(){
	echo "Usage: $0 -i <identity> -t <target> -scd"
	echo "-s specified will copy server"
	echo "-c specified will copy client build"
	echo "-d specified will copy deployment directory"
	echo "at least one of s, c, d must be selected"
	exit 1
}

while getopts "i:t:scd" opt
do
	case "$opt" in
		i ) identity="$OPTARG" ;;
		t ) target="$OPTARG" ;;
		s ) copy_server=true ;;
		c ) copy_client=true ;;
		d ) copy_deployment=true ;;
		? ) invalidArguments ;;
	esac
done

if [ -z "$identity" ]
then
	invalidArguments
fi

if [ -z "$target" ]
then
	invalidArguments
fi

if [ ! $copy_deployment ] && [ ! $copy_server ] && [ ! $copy_client ]
then
	copy_deployment=true
	copy_server=true
	copy_client=true
fi

# ensure client build exists
if [ $copy_client ] && [ ! -d "../client/build" ]
then
	echo "Client build doesn't exist"
	exit 1
fi

# ensure server directory exists
if [ $copy_server ] && [ ! -d "../server" ]
then
	echo "Server directory doesn't exist"
	exit 1
fi

# ensure deployment directory exists
if [ $copy_deployment ] && [ ! -d "../deploy" ]
then
	echo "Deploy directory doesn't exist"
	exit 1
fi

# copy deployment files
if [ $copy_deployment ]
then
	echo "Copying deployment directory..."
	ssh -i $identity $target 'rm -rf ~/deploy && mkdir ~/deploy'

	for d in ./*;
	do
		if [ "$d" != "./sendfiles.sh" ]
		then
			scp -i $identity -r $d "${target}:deploy"
		fi
	done
fi


# copy server files
if [ $copy_server ]
then
	echo "Copying server directory..."
	ssh -i $identity $target 'rm -rf ~/server && mkdir ~/server'

	for d in ../server/*;
	do
		if [ "$d" != "../server/node_modules" ] && [ "$d" != "../server/README.md" ] && [ "$d" != "../server/uploads" ] && [ "$d" != "../server/package-lock.json" ]
		then
			scp -i $identity -r $d "${target}:server"
		fi
	done
fi



# copy client build files
if [ $copy_client ]
then
	echo "Copying client build..."
	ssh -i $identity $target 'rm -rf ~/client && mkdir ~/client'

	for d in ../client/build/*;
	do
		scp -i $identity -r $d "${target}:client"
	done
fi
