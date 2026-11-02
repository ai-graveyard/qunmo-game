#!/bin/zsh
cd "${0:A:h}"
if ! command -v node >/dev/null 2>&1; then
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
  fi
fi
if ! command -v node >/dev/null 2>&1; then
  print "需要先安装 Node.js 18 或更新版本：https://nodejs.org"
  read -k 1 "?按任意键退出"
  exit 1
fi
node server.mjs --open
