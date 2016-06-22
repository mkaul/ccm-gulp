# ccm-gulp
gulp scripts for ccm components management. gulp writes minified files to the resources directory on github.io and adapts all server URLs accordingly. JSON files are transformed into JSONP files for cross domain access and universal embeddability. For more details see `gulpfile.js`. 

For getting started with gulp see [gulp getting-started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## 1. Install

    npm install --global gulp-cli  

    git clone https://github.com/mkaul/ccm-gulp.git
    
    cd ccm-gulp
    
    npm install
 
For the node.js and npm installation, see [how-to-install-npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm). According to your npm installation, maybe the first command needs "sudo npm install -g gulp-cli". 
    
## 2. Configure
Download your [GitHub Pages](https://pages.github.com) into a local directory called `ccm-components-page` as a neighbour directory next to `ccm-components` and `ccm-gulp`.
    
    git clone -b master --single-branch https://github.com/USER/ccm-components.git ccm-components
    
    git clone -b gh-pages --single-branch https://github.com/USER/ccm-components.git ccm-components-page
    
    edit config.json # e.g. enter your user name and repositories  
    
## 3. Execute
        
    gulp
    
    
# Convention over Configuration
- In your `ccm-components` directory create one extra directory per component.
- Use *relative paths* in your ccm component files such as `'../' + directory_name + '/' + file_name`, so that you can test your implementation locally. Deployment via ccm-gulp includes remotification (via task `gulp js`), which performs a replacement of all local paths by *absolute paths*.
- Use GitHub Hosting under `http://USER.github.io/ccm-components` for your ccm components, see ["Project Pages site owned by a user account"](https://help.github.com/articles/user-organization-and-project-pages/).
- Use `resources` for storing your remotified ccm components.
- Use `api` for storing the API documentation of your ccm components 
- Download the `gh-pages` branch of your Project Pages site into a neigbour folder called `ccm-components-page`.
- optionally insert `<!-- api_begin --><!-- api_end -->` into `index.html` at a place where you want to generate a list of API documents of all ccm components in your repo 
- run `gulp` for generating or updating your remotified ccm components and their documentation. 

If your GitHub Repository is `https://github.com/USER/ccm-components`, you can generate your ["Project Pages site owned by a user account"](https://help.github.com/articles/user-organization-and-project-pages/), which will be hosted under `http://USER.github.io/ccm-components`. The project pages are stored in the branch `gh-pages` in the same project repo. If you download the `gh-pages` branch of your Project Pages site into a neigbour folder called `ccm-components-page`, the gulp task `gulp js` will generate remotified components into the `resources` subdirectory underneath the `ccm-components-page` directory, the gulp task `gulp doc` will generate API documentation into the `api` subdirectory underneath the `ccm-components-page` directory. Otherwise reconfigure `config.json` to adapt to your structure.
 
# Other Configurations
Other Configurations may be added to `config.json` oder `gulpfile.js`  directly.

    "gulp": {
      "user": "mkaul",              // USER on GitHub
      "repo": "ccm-components",     // repository name on GitHub
      "exclude_folders": {          // folders without ccm-components 
        ".git": true,
        ".idea": true,
        "api": true,
        "dist": true,
        "fonts": true,
        "images": true,
        "javascripts": true,
        "libs": true,
        "stylesheets": true
      },
      "repo_suffix": "-page",       // repository suffix for gh-pages branch of your Project Pages
      "api_dirname": "api",         // name of directory of API documentation
      "index_file": "index.html",   // file for indexing all documents of all ccm components in your repo
      "destination": "resources/",  // directory for remotified ccm components
      "external_components": "external_components",  // directory for extra components not in your own repository
      "server_url": "http://{user}.github.io/{repo}/resources/"  // URL with placeholders
    },