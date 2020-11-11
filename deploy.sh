#!/bin/bash

set -e

git_c () {
  ssh-agent bash -c "ssh-add /var/www/github/sham; $1"
}

git clean -fd
git reset --hard

branch=$(git branch | grep '*' | awk '{ print $2 }')

git_c "git pull origin $branch"

npm i
npm run build
npm run export

