<xsl:transform xmlns:xsl = "http://www.w3.org/1999/XSL/Transform" version = "1.0">
    <!--Some values needed in more than one place -->
    <xsl:variable name = "target" select = "'Main'"/>
    <xsl:variable name = "filename" select = "'TreePage.htm'"/>
    <xsl:variable name = "bgcolour" select = "white"/>
    <!--======MAIN ======  -->
    <xsl:template match = "/">
        <html>
            <head>
                <xsl:call-template name = "css-style"/>
                <xsl:variable name = "name">
                    <xsl:apply-templates select = "NAME"/>
                </xsl:variable>
                <title>
                    <xsl:value-of select = "$name"/>
                </title>
            </head>
            <body>
                <xsl:for-each select = "/*/INDI">
                    <xsl:sort select = "string-length(substring-before(substring-after(NAME,'/'), '/')) = 0"/>
                    <xsl:sort select = "substring-before(substring-after(NAME,'/'), '/')"/>
                    <xsl:sort select = "NAME"/>
                    <a>
                        <xsl:apply-templates select = "NAME" mode = "link"/>
                        &#xa0;
                    </a>
                    <br/>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
    <!--====== Individual names ======  -->
    <xsl:template match = "NAME" mode = "link">
        <a>
            <xsl:attribute name = "target">
                <xsl:value-of select = "$target"/>
            </xsl:attribute>
            <xsl:attribute name = "href">
                <xsl:call-template name = "make-href"/>
            </xsl:attribute>
            <xsl:apply-templates select = "."/>
        </a>
    </xsl:template>
    <xsl:template match = "NAME">
        <xsl:choose>
            <xsl:when test = "string-length(.) = 2 + string-length(translate(., '/', ''))">
                <xsl:value-of select = "substring-before(., '/')"/>
                <xsl:text>&#160;</xsl:text>
                <b>
                    <u>
                        <xsl:value-of select = "substring-before(substring-after(.,'/'), '/')"/>
                    </u>
                </b>
                <xsl:text>&#160;</xsl:text>
                <xsl:value-of select = "substring-after(substring-after(.,'/'), '/')"/>
            </xsl:when>
            <xsl:otherwise>
                <xsl:value-of select = "."/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    <xsl:template name = "make-href">
        <xsl:value-of select = "concat(concat($filename,'#'), ../@ID)"/>
    </xsl:template>
    <!--====== STYLE ======  -->
    <xsl:template name = "css-style">
        <style type = "text/css">
            BODY {
            background-color:
            <xsl:value-of select = "$bgcolour"/>
            }
            
            P,LI,TD {
            font-family: Lucida Sans, Helvetica, sans-serif;
            font-size: 10pt;
            font-weight: normal;
            color: black;       
            }
            
            TABLE {
            border-width: 0;   
            border-spacing: 1;
            padding: 1;
            border-color: lightgray;
            border-style: solid;
            margin: 1;
            cellspacing: 0;
            }
            TD {
            text-align: center;
            <!--border-width: 1;   -->
            border-width: 0;   
            border-spacing: 1;
            border-color: lightgray;
            border-style: solid;
            
            }
        </style>
    </xsl:template>
</xsl:transform>
