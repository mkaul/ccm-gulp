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
Use relative paths in your ccm component files such as '../' + directory_name + '/' + file_name, so that you can test your implementation locally.
Deployment via gulp includes remotification (gulp js), which is a replacement of all local paths by absolute paths.

If your GitHub Repository is "https://github.com/USER/ccm-components", you can generate ["Project Pages site owned by a user account"](https://help.github.com/articles/user-organization-and-project-pages/), which will be hosted under "http://USER.github.io/ccm-components". The project pages are stored in the branch "gh-pages" in the same project repo. If you download the "gh-pages" branch of your Project Pages site into a neigbour folder called "ccm-components-page", the gulp task "gulp js" will generate remotified components into the "resources" subdirectory underneath the "ccm-components-page" directory, the gulp task "gulp doc" will generate API documentation into the "api" subdirectory underneath the "ccm-components-page" directory. Otherwise reconfigure config.json to adapt to your structure.
 
# Other Configurations
Other Configurations may be added to config.json oder gulpfile.js directly. 