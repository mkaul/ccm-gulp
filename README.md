# ccm-gulp
gulp scripts for ccm components management. gulp writes minified files to the dist directory and adapts all server URLs accordingly. JSON files are transformed into JSONP files for cross domain access. For more details see gulpfile.js. 

For getting started with gulp see [gulp getting-started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## 1. Install

    npm install --global gulp-cli

    git clone https://github.com/mkaul/ccm-gulp.git
    
    npm install
    
## 2. Configure
    
    edit config.json # e.g. enter your user name and repositories  
    
## 3. Execute
        
    gulp
    
    
# Conventions over Configuration
Use relative paths in your ccm component files as '../' + directory_name + '/' + file_name. Then you can test your implementation locally.
Deployment via gulp includes remotification, which is a replacement of all local paths by absolute paths.