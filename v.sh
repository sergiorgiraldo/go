#!/bin/sh

version_=$(cat ./VERSION)

if [ "$1" == "major" ]; then
	major_=$(semver -t <<< "$version_" | awk -F '\t' '{ print ++$1 "." 0 "." 0 }')
	echo $major_ > VERSION
elif [ "$1" == "minor" ]; then
	minor_=$(semver -t <<< "$version_" | awk -F '\t' '{ print $1 "." ++$2 "." 0 }')
	echo $minor_ > VERSION
elif [ "$1" == "patch" ]; then
	patch_=$(semver -t <<< "$version_" | awk -F '\t' '{ print $1 "." $2 "." ++$3 }')
	echo $patch_ > VERSION
else
  echo "Invalid parameter passed"
  exit 1
fi
