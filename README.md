# AEM Future
The purpose of this repo is to create a way for developers to easily begin using
the latest frontend dev tools in their workflow while still adhering to the AEM
life.

## Assumptions
The gulp pipeline makes a few assumptions that you can checkout by looking at it more indepth, but I'll do a quick overview here. 

1. In your component's clientlibs you should have an es6 directory and a sass directory which you put your respective files. You'll also need to add the compiled names to the js/css.txt files like normal (with *.css/js).
2. These files should go directly under your jcr_root.
3. You have vault added to your path, you can find more info here: https://docs.adobe.com/docs/en/aem/6-2/develop/dev-tools/ht-vlttool.html

## Things to do
1. Integrate into Maven?
2. Add in polyfills for other es2015 features.
3. Add coverage report after tests are run
4. Implement test runner so it can run in the browser.
5. Add sourcemaps so debugging the minified versions is a little easier.
6. Add E2E testing with selenium, not sure if this is doable.

## Steps for using SASS/ES6 in AEM (with Testing!)
1. Install nodejs from nodejs.org if you're on windows, or use homebrew on OSX
to install it using brew install nodejs
2. Install phantomjs from phantomjs.org if you're on windows, or use homebrew
on OSX to install it using brew install phantomjs
3. Assuming nodejs is in your path use npm install gulp --save
4. Put the package.json and gulpfile.js under your jcr_root folder.
5. Run a npm install from the commandline.
6. Now you have a couple of options (A lot more but check the gulp file):
  - gulp watch - watches folders for new changes and pushes to crx
  - gulp sass - compiles all scss files to css and places them in css
  - gulp babel - compiles all es6 files to js and places them in js
  - gulp test - runs files in the test directory under each es6 folder
              and gives a report.
  - gulp compress - Not used by the build command but does compression on
                  output js files.
  - gulp build - runs test and if it passes it'll compile the es6 and scss files.
7. Add es6,sass,node_modules to your vault ignore patterns in your IDE of choice.
8. Another thing to check is in the gulpfile.js for the sass task. As part of the
process I do autoprefixing to save your fingers from all the browser specific
stuff. You'll see a line in there for a browsers property to configure this for
your business needs see: https://github.com/postcss/autoprefixer#options
