rm -rf build/web/
mkdir -p build/web/
mkdir -p build/web/assets/
mkdir -p build/web/files/
cp src/assets/* build/web/assets/
node --use_strict --harmony tools/webBuild.js --includeTestView

echo "Building complete, check 'build/web/' for output."