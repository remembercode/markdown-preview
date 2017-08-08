(function(document) {

    var interval,
        defaultReloadFreq = 3,
        previousText,
        storage = chrome.storage.local;

    function getExtension(url) {
        url = url.substr(1 + url.lastIndexOf("/"))
            .split('?')[0]
            .split('#')[0];
        var ext = url.substr(1 + url.lastIndexOf("."));
        return ext.toLowerCase();
    }

    function resolveImg(img) {
        var src = $(img).attr("src");
        if (src[0] == "/") {
            $(img).attr("src", src.substring(1));
        }
    }

    function runMathjax(data) {
        // Create hidden div to use for MathJax processing
        var mathjaxDiv = $("<div/>").attr("id", config.mathjaxProcessingElementId)
                            .text(data)
                            .hide();
        $(document.body).append(mathjaxDiv);

        $.getScript(chrome.extension.getURL('js/marked.js'));
        $.getScript(chrome.extension.getURL('js/highlight.js'), function() {
            $.getScript(chrome.extension.getURL('js/config.js'));
        });
        $.getScript(chrome.extension.getURL('js/runMathJax.js'));
    }

    // Onload, take the DOM of the page, get the markdown formatted text out and
    // apply the converter.
    function makeHtml(data) {
        storage.get(['mathjax', 'html'], function(items) {
            // Convert MarkDown to HTML without MathJax typesetting.
            // This is done to make page responsiveness.  The HTML body
            // is replaced after MathJax typesetting.
            if (items.html) {
                config.markedOptions.sanitize = false;
            }
            marked.setOptions(config.markedOptions);
            var html = marked(data);
            $(document.body).html(html);

            $('img').on("error", function() {
                resolveImg(this);
            });

            // Apply MathJax typesetting
            if (items.mathjax) {
                runMathjax(data);
            }
			
			// 生成导航栏 begin
			//是否显示导航栏
			var showNavBar = true;
			//是否展开导航栏
			var expandNavBar = true;

			$(document).ready(function(){
				var h1s = $("body").find("h1");
				var h2s = $("body").find("h2");
				var h3s = $("body").find("h3");
				var h4s = $("body").find("h4");
				var h5s = $("body").find("h5");
				var h6s = $("body").find("h6");

				var headCounts = [h1s.length, h2s.length, h3s.length, h4s.length, h5s.length, h6s.length];
				var vH1Tag = null;
				var vH2Tag = null;
				for(var i = 0; i < headCounts.length; i++){
					if(headCounts[i] > 0){
						if(vH1Tag == null){
							vH1Tag = 'h' + (i + 1);
						}else{
							vH2Tag = 'h' + (i + 1);
						}
					}
				}
				if(vH1Tag == null){
					return;
				}

				$("body").prepend('<div class="BlogAnchor">' + 
					'<span style="color:red;position:absolute;top:-6px;left:0px;cursor:pointer;" onclick="$(\'.BlogAnchor\').hide();">×</span>' +
					'<p>' + 
						'<b id="AnchorContentToggle" title="收起" style="cursor:pointer;">目录▲</b>' + 
					'</p>' + 
					'<div class="AnchorContent" id="AnchorContent"> </div>' + 
				'</div>' );

				var vH1Index = 0;
				var vH2Index = 0;
				$("body").find("h1,h2,h3,h4,h5,h6").each(function(i,item){
					var id = '';
					var name = '';
					var tag = $(item).get(0).tagName.toLowerCase();
					var className = '';
					if(tag == vH1Tag){
						id = name = ++vH1Index;
						name = id;
						vH2Index = 0;
						className = 'item_h1';
					}else if(tag == vH2Tag){
						id = vH1Index + '_' + ++vH2Index;
						name = vH1Index + '.' + vH2Index;
						className = 'item_h2';
					}
					$(item).attr("id","wow"+id);
					$(item).addClass("wow_head");
					$("#AnchorContent").css('max-height', ($(window).height() - 180) + 'px');
					//$("#AnchorContent").append('<li><a class="nav_item '+className+' anchor-link" onclick="return false;" href="#" link="#wow'+id+'">'+name+" · "+$(this).text()+'</a></li>');
					$("#AnchorContent").append('<li><a class="nav_item '+className+' anchor-link" onclick="return false;" href="#" link="#wow'+id+'">'+""+" "+$(this).text()+'</a></li>');
				});

				$("#AnchorContentToggle").click(function(){
					var text = $(this).html();
					if(text=="目录▲"){
						$(this).html("目录▼");
						$(this).attr({"title":"展开"});
					}else{
						$(this).html("目录▲");
						$(this).attr({"title":"收起"});
					}
					$("#AnchorContent").toggle();
				});
				$(".anchor-link").click(function(){
					$("html,body").animate({scrollTop: $($(this).attr("link")).offset().top}, 500);
				});

				var headerNavs = $(".BlogAnchor li .nav_item");
				var headerTops = [];
				$(".wow_head").each(function(i, n){
					headerTops.push($(n).offset().top);
				});
				$(window).scroll(function(){
					var scrollTop = $(window).scrollTop();
					$.each(headerTops, function(i, n){
						var distance = n - scrollTop;
						if(distance >= 0){
							$(".BlogAnchor li .nav_item.current").removeClass('current');
							$(headerNavs[i]).addClass('current');
							return false;
						}
					});
				});

				if(!showNavBar){
					$('.BlogAnchor').hide();
				}
				if(!expandNavBar){
					$(this).html("目录▼");
					$(this).attr({"title":"展开"});
					$("#AnchorContent").hide();
				}
			});
			// 生成导航栏 end
			
        });
    }

    function getThemeCss(theme) {
        return chrome.extension.getURL('theme/' + theme + '.css');
    }

    function setTheme(theme) {
        var defaultThemes = ['Clearness', 'ClearnessDark', 'Github', 'TopMarks', 'YetAnotherGithub'];

        if($.inArray(theme, defaultThemes) != -1) {
            var link = $('#theme');
            $('#custom-theme').remove();
            if(!link.length) {
                var ss = document.createElement('link');
                ss.rel = 'stylesheet';
                ss.id = 'theme';
                //ss.media = "print";
                ss.href = getThemeCss(theme);
                document.head.appendChild(ss);
            } else {
                link.attr('href', getThemeCss(theme));
            }
        } else {
            var themePrefix = 'theme_',
                key = themePrefix + theme;
            storage.get(key, function(items) {
                if(items[key]) {
                    $('#theme').remove();
                    var theme = $('#custom-theme');
                    if(!theme.length) {
                        var style = $('<style/>').attr('id', 'custom-theme')
                                        .html(items[key]);
                        $(document.head).append(style);
                    } else {
                        theme.html(items[key]);
                    }
                }
            });
        }
    }

    function stopAutoReload() {
        clearInterval(interval);
    }

    function startAutoReload() {
        stopAutoReload();

        var freq = defaultReloadFreq;
        storage.get('reload_freq', function(items) {
            if(items.reload_freq) {
                freq = items.reload_freq;
            }
        });

        interval = setInterval(function() {
            $.ajax({
                url: location.href,
                cache: false,
                success: function(data) {
                    if (previousText == data) {
                        return;
                    }
                    makeHtml(data);
                    previousText = data;
                }
            });
        }, freq * 1000);
    }

    function render() {
        $.ajax({
            url: location.href,
            cache: false,
            complete: function(xhr, textStatus) {
                var contentType = xhr.getResponseHeader('Content-Type');
                if(contentType && (contentType.indexOf('html') > -1)) {
                    return;
                }

                makeHtml(document.body.innerText);
                var specialThemePrefix = 'special_',
                    pageKey = specialThemePrefix + location.href;
                storage.get(['theme', pageKey], function(items) {
                    theme = items.theme ? items.theme : 'Clearness';
                    if(items[pageKey]) {
                        theme = items[pageKey];
                    }
                    setTheme(theme);
                });

                storage.get('auto_reload', function(items) {
                    if(items.auto_reload) {
                        startAutoReload();
                    }
                });
            }
        });
    }

    storage.get(['exclude_exts', 'disable_markdown', 'mathjax', 'html', 'enable_latex_delimiters'], function(items) {
        if (items.disable_markdown) {
            return;
        }

        if (items.enable_latex_delimiters) {
            config.enableLatexDelimiters();
        }

        if (items.mathjax) {
            // Enable MathJAX LaTeX delimiters
            // Add MathJax configuration and js to document head
            $.getScript('https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML');
            var mjc = $('<script/>').attr('type', 'text/x-mathjax-config')
                .html("MathJax.Hub.Config(" + JSON.stringify(config.mathjaxConfig) + ");");
            $(document.head).append(mjc);
        }

        var allExtentions = ["md", "text", "markdown", "mdown", "txt", "mkd", "rst", "rmd"];
        var exts = items.exclude_exts;
        if(!exts) {
            render();
            return;
        }

        var fileExt = getExtension(location.href);
        if (($.inArray(fileExt, allExtentions) != -1) && 
            (typeof exts[fileExt] == "undefined")) {
            render();
        }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        var specialThemePrefix = 'special_',
            pageKey = specialThemePrefix + location.href;
        for (key in changes) {
            var value = changes[key];
            if(key == pageKey) {
                setTheme(value.newValue);
            } else if(key == 'theme') {
                storage.get(pageKey, function(items) {
                    if(!items[pageKey]) {
                        setTheme(value.newValue);
                    }
                });
            } else if(key == 'reload_freq') {
                storage.get('auto_reload', function(items) {
                    startAutoReload();
                });
            } else if(key == 'auto_reload') {
                if(value.newValue) {
                    startAutoReload();
                } else {
                    stopAutoReload();
                }
            } else if(key == 'disable_markdown') {
                location.reload();
            }
        }
    });

}(document));
