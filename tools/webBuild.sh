rm -rf build/web/
mkdir -p build/web/
node --use_strict --harmony tools/webBuild.js
mkdir -p build/web/assets/
cp src/core/assets/* build/web/assets/
cp src/user/assets/* build/web/assets/

echo "Building complete, check 'build/web/' for output."