SHELL=cmd.exe

default:
	echo "Parameter missing"

include temp.make

dev: build build/files build/assets css assets build/index.html app.js

build:
	mkdir build

build/files:
	mkdir build\files

build/assets:
	mkdir build\assets

build/index.html: src/index.html tools/makeIndex.js
	node tools/makeIndex.js > $@

app.js:
	browserify -d src/user/helloWorld.js > build/files/$@

temp.make:
	node tools/generateMake.js > $@

server:
	node tools/server.js &

test:
	tools/runTest.sh

clean:
	-rm -rf build/
	-rm temp.make

.PHONY: default server test app.js
