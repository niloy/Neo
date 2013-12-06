default:
	echo "Parameter missing"

server:
	node tools/server.js &

test:
	tools/runTest.sh

build: web webapp

web:
	tools/webBuild.sh

webapp:
	tools/webAppBuild.sh

clean:
	rm -rf build/

.PHONY: default server test build web webapp
