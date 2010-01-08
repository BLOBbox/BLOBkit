VERSION = 1.5.0
YUI_VERSION = 2.8.0r4
COMP_VERSION = 2.4.2
YUIDOC_VERSION = 1.0.0b1

INTEGRATION_PACKAGE_NAME = Web-BLOBkit

YUI_URL = "http://yui.yahooapis.com/combo?$(YUI_VERSION)/build/yahoo-dom-event/yahoo-dom-event.js&$(YUI_VERSION)/build/connection/connection-min.js&$(YUI_VERSION)/build/json/json-min.js"
#YUI_DOWNLOAD = "http://ovh.dl.sourceforge.net/sourceforge/yui/yui_$(YUI_VERSION).zip"
YUI_DOWNLOAD = "http://yuilibrary.com/downloads/yui2/yui_$(YUI_VERSION).zip"
COMP_DOWNLOAD = "http://www.julienlecomte.net/yuicompressor/yuicompressor-$(COMP_VERSION).zip"
YUIDOC_DOWNLOAD = "http://yuilibrary.com/downloads/yuidoc/yuidoc_$(YUIDOC_VERSION).zip"

YUI_SOURCES = yui-$(YUI_VERSION)/build/yahoo/yahoo.js yui-$(YUI_VERSION)/build/dom/dom.js yui-$(YUI_VERSION)/build/event/event.js yui-$(YUI_VERSION)/build/connection/connection.js yui-$(YUI_VERSION)/build/json/json.js
TVB_SOURCES = src/exceptions/exceptions.js src/extensions/extensions.js src/system/system.js src/json/json.js src/event/event.js src/connection/connection.js src/remote/remote.js src/player/player.js src/ad/ad.js src/podcast/podcast.js src/widgets/widgets.js src/menu/menu.js src/i18n/i18n.js src/vfs/vfs.js src/tuner/tuner.js src/favorites/favorites.js
DEB_YUI = yui-$(YUI_VERSION)/build/profiler/profiler.js 
DEB_TVB = src/profiler/profiler.js
NON_DEB = 

SOURCES =  src/tvblob/tvblob.js $(NON_DEB) $(YUI_SOURCES) $(TVB_SOURCES)
DEBUG_SOURCES = src/tvblob/tvblob.js $(DEB_TVB) $(YUI_SOURCES) $(DEB_YUI) $(TVB_SOURCES)
DOC_SOURCES = src/tvblob/tvblob.js $(DEB_TVB) $(TVB_SOURCES)

LIB_BASENAME = tvb
LIB_NAME = $(LIB_BASENAME)-$(VERSION).js
LIB_MIN = $(LIB_BASENAME)-$(VERSION)-min.js
LIB_DOC = $(LIB_BASENAME)-$(VERSION)-doc.js
LIB_ZIP = $(LIB_BASENAME)-$(VERSION).zip
LIB_DEB = $(LIB_BASENAME)-$(VERSION)-debug.js

CAT = cat  
OUTDIR = build
YUICOMP = java -jar yuicompressor-$(COMP_VERSION)/build/yuicompressor-$(COMP_VERSION).jar --line-break 1000
#YUICOMP = yuicompressor --line-break 1000

PWD = $(shell pwd)/

BUILD = $(shell svn info | grep "Revision: " | sed -e 's/Revision: \(\d*\)/\1/g')
LAST_CHANGE_DATE = $(shell svn info | grep "Last Changed Date: " | sed -e 's/Last Changed Date: \(.*\)/\1/g')
LAST_CHANGE_AUTHOR = $(shell svn info | grep "Last Changed Author: " | sed -e 's/Last Changed Author: \(.*\)/\1/g')

APTANA_ID = com.tvblob.blobkit
APTANA_FEATURE_ID = com.tvblob.developers
APTANA_VERSION = $(VERSION).$(BUILD)
APTANA_COMPONENT = $(APTANA_ID)_$(APTANA_VERSION)
APTANA_FEATURE = $(APTANA_FEATURE_ID)_$(APTANA_VERSION)

DESTDIR = $(INTEGRATION_PACKAGE_NAME)-$(VERSION)b$(BUILD)

lib: yui-$(YUI_VERSION) yuicompressor-$(COMP_VERSION) $(LIB_NAME) $(LIB_MIN) $(LIB_DEB)
	# Build done  

doc: yuidoc-$(YUIDOC_VERSION) $(LIB_DOC)

all: lib doc $(LIB_ZIP) aptana
	# Build done

fix: lib installfix

yuidoc-$(YUIDOC_VERSION):
	wget $(YUIDOC_DOWNLOAD)
	unzip yuidoc_$(YUIDOC_VERSION).zip
	if [ -e "yuidoc_$(YUIDOC_VERSION).zip" ]; then rm yuidoc_$(YUIDOC_VERSION).zip; fi
	mv yuidoc yuidoc-$(YUIDOC_VERSION)

yui-$(YUI_VERSION):
	wget $(YUI_DOWNLOAD)
	unzip yui_$(YUI_VERSION).zip
	-rm yui_$(YUI_VERSION).zip
	-rm -rf yui/docs
	-rm -rf yui/tests
	-rm -rf yui/examples
	-rm -rf yui/as-docs
	-rm -rf yui/as-src
	-rm -rf yui/README
	-rm -rf yui/index.html
	#2.6.0 only
	#patch -p0 yui/build/yahoo/yahoo.js < patch/yahoo.diff
	#2.7.0b only
	#patch -p0 yui/build/event/event.js < patch/event.js.diff
	#2.8.0r4 only
	patch -p0 yui/build/event/event.js < patch/event_2.8.0r4.js.diff
	mv yui yui-$(YUI_VERSION)

yuicompressor-$(COMP_VERSION):
	wget $(COMP_DOWNLOAD)
	unzip yuicompressor-$(COMP_VERSION)
	#mv yuicompressor-$(COMP_VERSION) yuicompressor
	if [ -e "yuicompressor-$(COMP_VERSION).zip" ]; then rm yuicompressor-$(COMP_VERSION).zip; fi

$(LIB_NAME):
	# Building $(LIB_NAME)...
	# svn update
	mkdir -p $(OUTDIR)
	$(CAT) $(SOURCES) > $(OUTDIR)/$(LIB_NAME)
	sed -i    -e "s/TVB.log *(/\/\/TVB.log(/g" $(OUTDIR)/$(LIB_NAME)
	sed -i    -e "s/%%VERSION%%/$(VERSION) rev $(BUILD) build on $(LAST_CHANGE_DATE)/g" $(OUTDIR)/$(LIB_NAME)
	if [ -e "$(OUTDIR)/$(LIB_NAME)-e" ]; then rm $(OUTDIR)/$(LIB_NAME)-e; fi
	cd $(OUTDIR) && cp $(LIB_NAME) $(LIB_BASENAME).js 

$(LIB_DOC):
	# Building $(LIB_DOC)...
	mkdir -p $(OUTDIR)
	$(CAT) $(DOC_SOURCES) > $(OUTDIR)/$(LIB_DOC)
	sed -i    -e "s/TVB.log *(/\/\/TVB.log(/g" $(OUTDIR)/$(LIB_DOC)
	sed -i    -e "s/%%VERSION%%/$(VERSION) rev $(BUILD) build on $(LAST_CHANGE_DATE)/g" $(OUTDIR)/$(LIB_DOC)
	if [ -e "$(OUTDIR)/$(DOC)-e" ]; then rm $(OUTDIR)/$(LIB_DOC)-e; fi
	cd $(OUTDIR) && cp $(LIB_DOC) $(LIB_BASENAME)-doc.js
	if [ -d "$(OUTDIR)/docsrc" ]; then rm -r $(OUTDIR)/docsrc; fi
	if [ -d "$(OUTDIR)/doc" ]; then rm -r $(OUTDIR)/doc; fi
	if [ -d "$(OUTDIR)/docparse" ]; then rm -r $(OUTDIR)/docparse; fi
	
	mkdir -p $(OUTDIR)/docsrc
	mkdir -p $(OUTDIR)/doc
	mkdir -p $(OUTDIR)/docparse
	#cd $(OUTDIR) && cp $(LIB_BASENAME)-doc.js docsrc
	##cp -r $(DOC_SOURCES) $(OUTDIR)/docsrc
	cp -r src/* $(OUTDIR)/docsrc/
	sed -i    -e "s/%%VERSION%%/$(VERSION) rev $(BUILD) build on $(LAST_CHANGE_DATE)/g" $(OUTDIR)/docsrc/tvblob/*.js
	if [ -e "$(OUTDIR)/docsrc/tvblob/*.js-e" ]; then rm $(OUTDIR)/docsrc/tvblob/*.js-e; fi
	#python yuidoc-$(YUIDOC_VERSION)/bin/yuidoc.py $(PWD)$(OUTDIR)/docsrc -p $(PWD)$(OUTDIR)/docparse -o $(PWD)$(OUTDIR)/doc --template=$(PWD)doc_tpl --version=$(VERSION) --yuiversion=2 --project="BLOBkit Library" --projecturl=http://www.blobforge.com
	python yuidoc-223548a/bin/yuidoc.py $(PWD)$(OUTDIR)/docsrc -p $(PWD)$(OUTDIR)/docparse -o $(PWD)$(OUTDIR)/doc --template=$(PWD)doc_tpl --version=$(VERSION) --yuiversion=2 --project="BLOBkit Library" --projecturl=http://www.blobforge.com
	#if [ -d "$(OUTDIR)/docsrc" ]; then rm -rf $(OUTDIR)/docsrc; fi
	#if [ -d "$(OUTDIR)/docparse" ]; then rm -rf $(OUTDIR)/docparse; fi

$(LIB_DEB):
	# Building $(LIB_DEB)...
	mkdir -p $(OUTDIR)
	$(CAT) $(DEBUG_SOURCES) > $(OUTDIR)/$(LIB_DEB)
	sed -i    -e "s/%%VERSION%%/$(VERSION)-debug rev $(BUILD) build by $(LAST_CHANGE_AUTHOR) on $(LAST_CHANGE_DATE)/g" $(OUTDIR)/$(LIB_DEB)
	if [ -e "$(OUTDIR)/$(LIB_DEB)-e" ]; then rm $(OUTDIR)/$(LIB_DEB)-e; fi
	cd $(OUTDIR) && cp $(LIB_DEB) $(LIB_BASENAME)-debug.js
	cd $(OUTDIR) && cp $(LIB_DEB) ../samples/$(LIB_BASENAME)-debug.js

$(LIB_MIN):
	# Building $(LIB_MIN)...
	mkdir -p $(OUTDIR)
	$(YUICOMP) -o $(OUTDIR)/$(LIB_MIN) $(OUTDIR)/$(LIB_NAME)
	cd $(OUTDIR) && cp $(LIB_MIN) $(LIB_BASENAME)-min.js
	cd $(OUTDIR) && cp $(LIB_MIN) ../samples/$(LIB_BASENAME)-min.js

$(LIB_ZIP):
	# Building $(LIB_ZIP)...
	mkdir -p $(OUTDIR)/zip
	mkdir -p $(OUTDIR)/zip/samples
	mkdir -p $(OUTDIR)/zip/snippets
	mkdir -p $(OUTDIR)/zip/doc
	
	cp -r samples/* $(OUTDIR)/zip/samples/
	cp snippets/* $(OUTDIR)/zip/snippets/
	cp -r $(OUTDIR)/doc/* $(OUTDIR)/zip/doc/
	cd $(OUTDIR)/zip && find . -name .svn | xargs rm -rf
	cp $(OUTDIR)/$(LIB_NAME) $(OUTDIR)/zip/
	cp $(OUTDIR)/$(LIB_MIN) $(OUTDIR)/zip/
	cp $(OUTDIR)/$(LIB_DEB) $(OUTDIR)/zip/
	cd $(OUTDIR)/zip && zip -r ../$(LIB_ZIP) *
	cd $(OUTDIR) && rm -rf zip
	cd $(OUTDIR) && cp $(LIB_ZIP) $(LIB_BASENAME).zip
	
clean:
	# Cleaning folders...
	if [ -d "$(OUTDIR)" ]; then rm -rf $(OUTDIR); fi
	if [ -e "samples/$(LIB_BASENAME)-min.js" ]; then rm samples/$(LIB_BASENAME)-min.js; fi
	if [ -e "samples/$(LIB_BASENAME)-debug.js" ]; then rm samples/$(LIB_BASENAME)-debug.js; fi
	if [ -d "$(INTEGRATION_PACKAGE_NAME)*" ]; then rm -r $(INTEGRATION_PACKAGE_NAME)*; fi
	if [ -e "com.tvblob.blobkit_*.jar" ]; then rm com.tvblob.blobkit_*.jar; fi
	if [ -e "BLOBkit_*.zip" ]; then rm BLOBkit_*.zip; fi
	# Use make cleanall to clean everything

cleanall: clean
	# Cleaning libraries...
	if [ -d "yui-*" ]; then rm -r yui-*; fi
	if [ -d "yuicompressor-*" ]; then rm -r yuicompressor-*; fi
	if [ -d "yuidoc-*" ]; then rm -r yuidoc-*; fi

aptana: $(APTANA_COMPONENT).jar

$(APTANA_COMPONENT).jar:
	# Building Aptana/Eclipse plugin...
	mkdir -p $(APTANA_COMPONENT)
	mkdir -p $(APTANA_COMPONENT)/docs
	mkdir -p $(APTANA_COMPONENT)/icons
	mkdir -p $(APTANA_COMPONENT)/libraries/sm
	mkdir -p $(APTANA_COMPONENT)/libraries/lib/sm
	mkdir -p $(APTANA_COMPONENT)/META-INF
	mkdir -p $(APTANA_COMPONENT)/samples
	mkdir -p $(APTANA_COMPONENT)/scripts
	mkdir -p $(APTANA_COMPONENT)/snippets
	mkdir -p $(APTANA_COMPONENT)/support
	mkdir -p $(APTANA_COMPONENT)/views
	cp aptana_src/plugin.xml $(APTANA_COMPONENT)/
	sed -i    -e "s/%%VERSION%%/$(VERSION)/g" $(APTANA_COMPONENT)/plugin.xml
	if [ -e "$(APTANA_COMPONENT)/plugin.xml-e" ]; then rm $(APTANA_COMPONENT)/plugin.xml-e; fi
	cp aptana_src/build.properties $(APTANA_COMPONENT)/
	
	cp aptana_src/tvblob.png $(APTANA_COMPONENT)/icons
	
	cp -r $(OUTDIR)/doc/* $(APTANA_COMPONENT)/docs/
	cd $(APTANA_COMPONENT)/docs && find . -name .svn | xargs rm -rf
	
	cp aptana_src/index.xml $(APTANA_COMPONENT)/docs
	sed -i    -e "s/LibraryName/BLOBkit/g" $(APTANA_COMPONENT)/docs/index.xml
	if [ -e "$(APTANA_COMPONENT)/index.xml-e" ]; then rm $(APTANA_COMPONENT)/index.xml-e; fi

	cp build/$(LIB_BASENAME).js $(APTANA_COMPONENT)/libraries/lib/sm
	cp build/$(LIB_BASENAME)-min.js $(APTANA_COMPONENT)/libraries/lib/sm
	cp build/$(LIB_BASENAME)-doc.js $(APTANA_COMPONENT)/libraries/lib/sm
	cp build/$(LIB_BASENAME)-debug.js $(APTANA_COMPONENT)/libraries/lib/sm
	cp build/$(LIB_BASENAME).js $(APTANA_COMPONENT)/libraries/sm
	cp build/$(LIB_BASENAME)-min.js $(APTANA_COMPONENT)/libraries/sm
	cp build/$(LIB_BASENAME)-doc.js $(APTANA_COMPONENT)/libraries/sm
	cp build/$(LIB_BASENAME)-debug.js $(APTANA_COMPONENT)/libraries/sm
	cp build/$(LIB_BASENAME)-doc.js $(APTANA_COMPONENT)/support

	cp aptana_src/MANIFEST.MF $(APTANA_COMPONENT)/META-INF
	sed -i    -e "s/LibraryName/BLOBkit/g" $(APTANA_COMPONENT)/META-INF/MANIFEST.MF
	sed -i    -e "s/org.library.name.0.1/$(APTANA_COMPONENT)/g" $(APTANA_COMPONENT)/META-INF/MANIFEST.MF
	sed -i    -e "s/OrganizationName/TVBLOB Srl/g" $(APTANA_COMPONENT)/META-INF/MANIFEST.MF
	if [ -e "$(APTANA_COMPONENT)/MANIFEST.MF-e" ]; then rm $(APTANA_COMPONENT)/MANIFEST.MF-e; fi

	cp -r samples/* $(APTANA_COMPONENT)/samples
	cp snippets/* $(APTANA_COMPONENT)/snippets
	cd $(APTANA_COMPONENT) && find . -name .svn | xargs rm -rf
	
	find $(APTANA_COMPONENT)/samples -name \*.html | xargs sed -i -e "s/src='..\/tvb/src='http:\/\/www.blobforge.com\/static\/lib\/tvb/g"
	find $(APTANA_COMPONENT)/samples -name \*.html | xargs sed -i -e "s/href='..\/tvb.css/href='http:\/\/www.blobforge.com\/static\/lib\/samples\/tvb.css/g"
	find $(APTANA_COMPONENT)/samples -name \*-e | xargs rm
	
	cd $(APTANA_COMPONENT) && zip -r ../$(OUTDIR)/$(APTANA_COMPONENT).jar *
	if [ -d "$(APTANA_COMPONENT)" ]; then rm -r $(APTANA_COMPONENT); fi
	
	echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" > $(OUTDIR)/site.xml
	echo "<site>" >> $(OUTDIR)/site.xml
	echo "<description url=\"http://www.blobforge.com/static/lib/eclipse/\">" >> $(OUTDIR)/site.xml
	echo "BLOBforge - Home of the BLOBkit" >> $(OUTDIR)/site.xml
	echo "</description>" >> $(OUTDIR)/site.xml
	echo "<feature url=\"features/$(APTANA_FEATURE).jar\" id=\"$(APTANA_FEATURE_ID)\" version=\"$(APTANA_VERSION)\">" >> $(OUTDIR)/site.xml
	echo "<category name=\"SDK\" />" >> $(OUTDIR)/site.xml
	echo "</feature>" >> $(OUTDIR)/site.xml
	echo "<category-def name=\"SDK\" label=\"BLOBkit Javascript Library\" />" >> $(OUTDIR)/site.xml
	echo "</site>" >> $(OUTDIR)/site.xml
	
	cp aptana_src/artifacts.xml $(OUTDIR)/artifacts.xml
	sed -i    -e "s/BLOBKITVERSION/$(APTANA_VERSION)/g" $(OUTDIR)/artifacts.xml
	if [ -e "$(APTANA_FEATURE)/artifacts.xml-e" ]; then rm $(APTANA_FEATURE)/artifacts.xml-e; fi
	cd $(OUTDIR) && zip artifacts.jar artifacts.xml
	rm $(OUTDIR)/artifacts.xml
	
	cp aptana_src/content.xml $(OUTDIR)/content.xml
	sed -i    -e "s/BLOBKITVERSION/$(APTANA_VERSION)/g" $(OUTDIR)/content.xml
	if [ -e "$(APTANA_FEATURE)/content.xml-e" ]; then rm $(APTANA_FEATURE)/content.xml-e; fi
	cd $(OUTDIR) && zip content.jar content.xml
	rm $(OUTDIR)/content.xml

	mkdir -p $(APTANA_FEATURE)
	mkdir -p $(APTANA_FEATURE)/META_INF
	cp aptana_src/featureMANIFEST.MF $(APTANA_FEATURE)/META_INF/MANIFEST.MF
	cp aptana_src/feature.xml $(APTANA_FEATURE)/feature.xml	
	sed -i    -e "s/%%VERSION%%/$(APTANA_VERSION)/g" $(APTANA_FEATURE)/feature.xml
	if [ -e "$(APTANA_FEATURE)/feature.xml-e" ]; then rm $(APTANA_FEATURE)/feature.xml-e; fi
	cd $(APTANA_FEATURE) && zip -r ../$(OUTDIR)/$(APTANA_FEATURE).jar *
	if [ -d "$(APTANA_FEATURE)" ]; then rm -r $(APTANA_FEATURE); fi
	
release: all
	# Building release package
	if [ -d "$(DESTDIR)" ]; then rm -r $(DESTDIR); fi
	mkdir $(DESTDIR) 
	cp $(OUTDIR)/$(LIB_NAME) $(DESTDIR)/$(LIB_NAME)
	cp $(OUTDIR)/$(LIB_NAME) $(DESTDIR)/$(LIB_BASENAME).js
	
	cp $(OUTDIR)/$(LIB_DOC) $(DESTDIR)/$(LIB_DOC)
	cp $(OUTDIR)/$(LIB_DOC) $(DESTDIR)/$(LIB_BASENAME)-doc.js

	cp $(OUTDIR)/$(LIB_DEB) $(DESTDIR)/$(LIB_DEB)
	cp $(OUTDIR)/$(LIB_DEB) $(DESTDIR)/$(LIB_BASENAME)-debug.js

	cp $(OUTDIR)/$(LIB_MIN) $(DESTDIR)/$(LIB_MIN)
	cp $(OUTDIR)/$(LIB_MIN) $(DESTDIR)/$(LIB_BASENAME)-min.js

	cp $(OUTDIR)/$(LIB_ZIP) $(DESTDIR)/BLOBkit_$(VERSION).zip
	cp $(OUTDIR)/$(LIB_ZIP) $(DESTDIR)/BLOBkit.zip

	mkdir -p $(DESTDIR)/doc
	cp -r $(OUTDIR)/doc/* $(DESTDIR)/doc/
	
	mkdir -p $(DESTDIR)/samples
	cp -r samples/* $(DESTDIR)/samples/

	find $(DESTDIR)/samples -name \*.html | xargs sed -i -e "s/src='..\/tvb/src='http:\/\/www.blobforge.com\/static\/lib\/tvb/g"
	find $(DESTDIR)/samples -name \*.html | xargs sed -i -e "s/href='..\/tvb.css/href='http:\/\/www.blobforge.com\/static\/lib\/samples\/tvb.css/g"
	find $(DESTDIR)/samples -name \*-e | xargs rm
 	
	mkdir -p $(DESTDIR)/resources
	cp -r resources/* $(DESTDIR)/resources/
	
	mkdir -p $(DESTDIR)/eclipse
	cp $(OUTDIR)/site.xml $(DESTDIR)/eclipse
	cp $(OUTDIR)/artifacts.jar $(DESTDIR)/eclipse
	cp $(OUTDIR)/content.jar $(DESTDIR)/eclipse
	
	mkdir -p $(DESTDIR)/eclipse/features
	cp $(OUTDIR)/$(APTANA_FEATURE).jar $(DESTDIR)/eclipse/features
	
	mkdir -p $(DESTDIR)/eclipse/plugins
	cp $(OUTDIR)/$(APTANA_COMPONENT).jar $(DESTDIR)/eclipse/plugins
	
	cp LICENCE $(DESTDIR)/LICENCE
	
	cd $(DESTDIR) && find . -name .tmp\* | xargs rm 
	cd $(DESTDIR) && find . -name .svn | xargs rm -rf 
	cd $(DESTDIR) && tar zcvf ../$(DESTDIR).tar.gz *

	cp $(DESTDIR)/eclipse/plugins/*.jar .
	cp $(DESTDIR)/BLOBkit_$(VERSION).zip .
	
	tvblob_release -a release $(INTEGRATION_PACKAGE_NAME) $(VERSION)b$(BUILD)
	tvblob_release -a upload $(INTEGRATION_PACKAGE_NAME) $(VERSION)b$(BUILD) -f $(DESTDIR).tar.gz ANY
	
	rm -rf $(DESTDIR)
	rm $(DESTDIR).tar.gz
	
	chmod 755 install.sh
	chmod 755 install_production.sh
	
	./install.sh http://integration/storage/releases/$(DESTDIR).tar.gz
	#./install_production.sh http://integration/storage/releases/$(DESTDIR).tar.gz
	
