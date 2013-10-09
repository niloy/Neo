default:
	echo "Parameter missing"

server:
	node tools/server.js &

test:
	tools/runTest.sh

build: buildWeb buildWebApp

buildWeb:
	tools/webBuild.sh

buildWebApp:
	tools/webAppBuild.sh