SPA

Add proxy to git configuration in Eclipse:
- Open Eclipse
- Window -> Preferences -> Team -> Git -> Configuration
- Add Entry
- key: http.proxy
- value: "CURRENT_PROXY_VALUE"

Add build.xml in Eclipse ant:
- Open Eclipse
- Windows -> Short view -> Ant
- Add buildfiles -> spa -> build.xml

Add maven configuration in Eclipse;
- Open Eclipse
- Run as -> Run configurations -> Maven -> Right click -> New
- Name: Spa package
- Base directory: ${project_loc:spa}
- Goal package

Run project:
- Double click on "copy" in Ant tab
- Run as -> Maven build
