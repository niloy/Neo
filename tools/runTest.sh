if type curl > /dev/null; then
  if ! curl "http://localhost:8888" > /dev/null; then
    node tools/server.js &
    echo "Test server started..."
  fi
else
  echo "Make sure the test server is running. Test server can be started"
  echo "by executing this command -> node tools/server.js"
fi

if ! type phantomjs > /dev/null; then
  echo "phantomjs not found, please install from http://phantomjs.org/"
  echo "if phantomjs is already installed, make sure its available in PATH"
  exit 1
fi

rm -rf build/test/

for FILE in $(echo "$(ls src/test/*.js) $(ls src/user/*.js)")
do
  FILE=$(basename $FILE)
  VIEW=${FILE/%.js/}
  echo "Starting test -> $VIEW"
  phantomjs tools/pageTest.js $VIEW
  echo "Test complete -> $VIEW"
done

echo "Check 'build/test' folder for results"