# Markdown Preview Plus Mod With Auto Guide

Chrome Ext Project.
Simply integrate [markdown_nav](https://github.com/chris-peng/markdown_nav) and [markdown-preview](https://github.com/volca/markdown-preview)
You can see their origin README.md below.



# Origin

# markdown自动生成导航目录
把这一段代码插入到markdown生成的HTML文件的head标签中，将会自动根据markdown的标题按级别生成导航目录\([示例页面](https://chris-peng.github.io/markdown_nav/%E7%A4%BA%E4%BE%8B.html)\)：

	<script src="https://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js"></script>
    <script type="text/javascript">
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
            $("#AnchorContent").append('<li><a class="nav_item '+className+' anchor-link" onclick="return false;" href="#" link="#wow'+id+'">'+name+" · "+$(this).text()+'</a></li>');
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
    </script>
    <style>
        /*导航*/
        .BlogAnchor {
            background: #f1f1f1;
            padding: 10px;
            line-height: 180%;
            position: fixed;
            right: 48px;
            top: 48px;
            border: 1px solid #aaaaaa;
        }
        .BlogAnchor p {
            font-size: 18px;
            color: #15a230;
            margin: 0 0 0.3rem 0;
            text-align: right;
        }
        .BlogAnchor .AnchorContent {
            padding: 5px 0px;
            overflow: auto;
        }
        .BlogAnchor li{
            text-indent: 0.5rem;
            font-size: 14px;
            list-style: none;
        }
		.BlogAnchor li .nav_item{
			padding: 3px;
		}
        .BlogAnchor li .item_h1{
            margin-left: 0rem;
        }
        .BlogAnchor li .item_h2{
            margin-left: 2rem;
            font-size: 0.8rem;
        }
		.BlogAnchor li .nav_item.current{
			color: white;
			background-color: #5cc26f;
		}
        #AnchorContentToggle {
            font-size: 13px;
            font-weight: normal;
            color: #FFF;
            display: inline-block;
            line-height: 20px;
            background: #5cc26f;
            font-style: normal;
            padding: 1px 8px;
        }
        .BlogAnchor a:hover {
            color: #5cc26f;
        }
        .BlogAnchor a {
            text-decoration: none;
        }
    </style>


在MarkdownPad2中，可以通过菜单->工具->选项->高级->HTML head编辑器来自动插入以上代码。

-----------------------------------
参考：灵感和部分代码来自于[这里](http://www.iyanlei.com/markdown_catelog.html)

# Markdown Preview Plus

Automatically parses markdown files (.md) into HTML. This is useful
if you're writing markdown (ultimately targeting HTML) and want a quick
preview.

[Get it for Chrome][webstore]

Features
--------

1. Support auto reload.
2. Support external css file.
3. Customize theme for every md file.
4. Support github flavored markdown.
5. Export nicely formatted HTML.
6. Support MathJax.

Usage
-----

1. Install extension from [webstore][] (creates no new UI)
2. Check "Allow access to file URLs" in `chrome://extensions` listing: ![fileurls](http://i.imgur.com/qth3K.png)
3. Open local or remote .md file in Chrome.
4. See nicely formatted HTML!

Math Syntax
-----------

Markdown Preview Plus uses the MathJax engine to support rendering of
mathematical expressions.  Markdown Preview Plus supports the following math
syntax.  To minimize interference between Markdown and MathJax, some standard
LaTeX delimiters (indicated below) are disabled by default to avoid conflict
with Markdown syntax.  LaTeX syntax can be enabled in the options.

### Inline Math ###

* __Single Dollar Signs__ (requires LaTeX delimiters):
  <code class="tex2jax_ignore">`$math$`</code>.  When LaTeX syntax is enabled,
  dollar signs used in non-math contexts should be escaped with a backslash:
  <code class="tex2jax_ignore">`\$`</code>

* __Single Backslash with Parentheses__ (requires LaTex delimiters):
  <code class="tex2jax_ignore">`\(math\)`</code>.  Conflicts with Markdown's
  escaped syntax for parentheses `\(`.

* __Double Backslash with Parentheses__:
  <code class="tex2jax_ignore">`\\(math\\)`</code>

### Display Math ###

* __Single Backslash with Brackets__ (requires LaTeX delimiters):
  <code class="tex2jax_ignore">`\[math\]`</code>.  Conflicts with Markdown's
  escaped syntax for brackets `\[`.

* __Double Backslash with Brackets__:
  <code class="tex2jax_ignore">`\\[math\\]`</code>

* __Double Dollar Signs__:
  <code class="tex2jax_ignore">`$$math$$`</code>

* __LaTeX Environments__ (always available when MathJax is enabled)

  * <code class="tex2jax_ignore">`\begin{equation}math\end{equation}`</code>

  * <code class="tex2jax_ignore">`\begin{eqnarray}math\end{eqnarray}`</code>

  * ...

Thanks
------

Thanks to Kevin Burke for his [markdown-friendly stylesheet][style],
to chjj for his [JavaScript markdown processor][marked],
to Boris Smus for his [Markdown Preview][mp] and to
Swartz and Gruber for [Markdown][md].

[webstore]: https://chrome.google.com/webstore/detail/markdown-preview-plus/febilkbfcbhebfnokafefeacimjdckgl
[style]: http://kevinburke.bitbucket.org/markdowncss
[marked]: https://github.com/chjj/marked
[md]: http://en.wikipedia.org/wiki/Markdown
[mp]: https://github.com/borismus/markdown-preview


Links
-----------------

* [Change Log](https://github.com/volca/markdown-preview/wiki/Changelog)

