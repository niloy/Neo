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