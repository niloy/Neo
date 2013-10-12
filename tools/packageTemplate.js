{
  "comp{ComponentName}": {
    "files": ["core/{filename}.js", "core/{filename}.css"],
    "requires": "{requires}"
  },
  "{filename}Test": {
    "files": "test/{filename}Test.js",
    "requires": ["testFramework", "comp{ComponentName}"]
  }
}