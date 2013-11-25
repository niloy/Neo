rm -rf build/webApp/
mkdir -p build/webApp/assets/
mkdir -p build/webApp/files/
cp src/assets/* build/webApp/assets/
node --use_strict --harmony tools/webAppBuild.js

echo "Building complete, check 'build/webApp/' for output."