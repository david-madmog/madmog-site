<xsl:transform xmlns:xsl = "http://www.w3.org/1999/XSL/Transform" version = "1.0">
    <xsl:param name = "id" select = "/*/INDI[1]/@ID"/>
    <!--Some values needed in more than one place -->
    <!--<xsl:variable name = "bgcolour" select = "'&#035;DDDBCE'"/> -->
    <xsl:variable name = "bgcolour" select = "'white'"/>
    <xsl:variable name = "childwidth" select = "200"/>
    <xsl:variable name = "img-path" select = "'Imgs/'"/>
    <!--define keys to allow records to be found by their id -->
    <xsl:key name = "indi" match = "INDI" use = "@ID"/>
    <xsl:key name = "fam" match = "FAM" use = "@ID"/>
    <xsl:key name = "chil" match = "CHIL" use = "@REF"/>
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

		<script type='text/javascript'>
function DrawTree(ID, Number, w, h) {
    var a_canvas = document.getElementById(ID);

    var cw = w / Number;
    try {
	var context = a_canvas.getContext("2d");


    } catch(e){
        document.write('An error has occurred: '+e.message)
    }

    context.lineWidth = 1;
    context.strokeStyle="black";
    context.moveTo(cw/2,h/2);
    context.lineTo(w - cw/2,h/2);
    context.moveTo(w/2,0);
    context.lineTo(w/2, h/2);

    var cx = cw/2 ;
    for (var i = 1; i &lt;= Number; i++) {
    	context.moveTo(cx, h/2);
	    context.lineTo(cx, h);
	    cx = cx + cw ;
    }

    context.stroke();
}
		</script>


            </head>
            <body>
                <xsl:apply-templates select = "/*/FAM"/>
            </body>
        </html>
    </xsl:template>
    <!--====== FAM ======  -->
    <xsl:template match = "FAM">
        <TABLE width = "100%" align = "center" cellspacing = "0">
            <TR>
                <xsl:call-template name = "show-parents"/>
            </TR>
            <TR>
                <TD>&#160;</TD>
                <TD>|</TD>
                <TD>&#160;</TD>
                <TD>&#160;</TD>
                <TD>&#160;</TD>
                <TD>|</TD>
                <TD>&#160;</TD>
            </TR>
            <TR>
                <TD colspan = "3">
                    <xsl:call-template name = "show-husb"/>
                </TD>
                <TD>=</TD>
                <TD colspan = "3">
                    <xsl:call-template name = "show-wife"/>
                </TD>
            </TR>
            <TR>
                <TD colspan = "7">
                    <xsl:call-template name = "show-tree"/>
                </TD>
            </TR>
            <TR>
                <TD colspan = "7">
                    <xsl:call-template name = "show-children"/>
                </TD>
            </TR>
        </TABLE>
        <HR/>
    </xsl:template>
    <!--====== Parents ======  -->
    <xsl:template name = "show-parents">
        <xsl:variable name = "husb" select = "key('indi', HUSB/@REF)"/>
        <xsl:variable name = "wife" select = "key('indi', WIFE/@REF)"/>
        <xsl:if test = "$husb">
            <xsl:call-template name = "show-indi-parents">
                <xsl:with-param name = "indi" select = "HUSB"/>
            </xsl:call-template>
            <TD>&#160;</TD>
        </xsl:if>
        <xsl:if test = "$wife">
            <xsl:call-template name = "show-indi-parents">
                <xsl:with-param name = "indi" select = "WIFE"/>
            </xsl:call-template>
        </xsl:if>
    </xsl:template>
    <xsl:template name = "show-indi-parents">
        <xsl:param name = "indi"/>
        <xsl:variable name = "fam_chil" select = "key('chil', $indi/@REF)"/>
        <xsl:variable name = "father" select = "key('indi', $fam_chil/../HUSB/@REF)"/>
        <xsl:variable name = "mother" select = "key('indi', $fam_chil/../WIFE/@REF)"/>
        <!--Count of fathers... -->
        <xsl:if test = "count($father) = 0">
            <TD width = "20%">&#160;</TD>
            <TD width = "5%">=</TD>
        </xsl:if>
        <xsl:if test = "$father">
            <TD width = "20%">
                <xsl:apply-templates select = "$father/NAME" mode = "link"/>
                &#xa0;
            </TD>
            <TD width = "5%">=</TD>
        </xsl:if>
        <xsl:if test = "count($mother) = 0">
            <TD width = "20%">&#160;</TD>
        </xsl:if>
        <xsl:if test = "$mother">
            <TD width = "20%">
                <xsl:apply-templates select = "$mother/NAME" mode = "link"/>
                &#xa0;
            </TD>
        </xsl:if>
    </xsl:template>
    <!--====== Husb and Wife ======  -->
    <xsl:template name = "show-husb">
        <xsl:variable name = "husb" select = "key('indi', HUSB/@REF)"/>
        <xsl:if test = "$husb">
            <a id = "{HUSB/@REF}">
                <xsl:apply-templates select = "$husb/NAME" mode = "full"/>
                &#xa0;
            </a>
        </xsl:if>
    </xsl:template>
    <xsl:template name = "show-wife">
        <xsl:variable name = "wife" select = "key('indi', WIFE/@REF)"/>
        <xsl:if test = "$wife">
            <a id = "{WIFE/@REF}">
                <xsl:apply-templates select = "$wife/NAME" mode = "full"/>
                &#xa0;
            </a>
        </xsl:if>
    </xsl:template>
    <!--====== Children ======  -->
    <xsl:template name = "show-tree">
        <xsl:variable name = "children" select = "key('indi', CHIL/@REF)"/>
        <xsl:variable name = "famid" select = "key('fam', CHIL/@REF)"/>
	

	<xsl:element name = "canvas">
            <xsl:attribute name = "id">
		<xsl:value-of select = "concat('CA', @ID)"/>
	    </xsl:attribute>
            <xsl:attribute name = "height">50</xsl:attribute>
            <xsl:attribute name = "width">
               <xsl:value-of select = "$childwidth * count($children)"/>
	    <xsl:attribute name = "style">border:1px solid #000000;</xsl:attribute>
            </xsl:attribute>
	</xsl:element>

	<xsl:element name = "script">
            <xsl:attribute name = "type">text/javascript</xsl:attribute>
	    DrawTree( 
		"<xsl:value-of select = "concat('CA', @ID)"/>",
		<xsl:value-of select = "count($children)"/>, 
		<xsl:value-of select = "$childwidth * count($children)"/>, 50
	    )
	</xsl:element>
    </xsl:template>

    <xsl:template name = "show-children">
        <xsl:variable name = "children" select = "key('indi', CHIL/@REF)"/>
        <DIV align="center"><TABLE cellspacing = "0" align="center">
            <TR>
                <xsl:if test = "$children">
                    <xsl:for-each select = "$children">
                        <xsl:element name = "TD">
                            <xsl:attribute name = "WIDTH">
                                <xsl:value-of select = "$childwidth"/>
                            </xsl:attribute>
                            <!--If this individual has their own family, then we'll link to it. If not, we need to do them fully -->
                            <xsl:choose>
                                <xsl:when test = "count(FAMS)=0">
                                    <xsl:apply-templates select = "NAME" mode = "full"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:apply-templates select = "NAME" mode = "link"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:element>
                    </xsl:for-each>
                </xsl:if>
            </TR>
        </TABLE></DIV>
    </xsl:template>
    <!--====== Individual names ======  -->
    <xsl:template match = "NAME" mode = "link">
        <a>
            <xsl:attribute name = "href">
                <xsl:call-template name = "make-href"/>
            </xsl:attribute>
            <xsl:apply-templates select = "."/>
        </a>
    </xsl:template>
    <xsl:template match = "NAME" mode = "full">
        <xsl:apply-templates select = "."/>
        <xsl:call-template name = "show-events"/>
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
        <xsl:value-of select = "concat('#', ../@ID)"/>
    </xsl:template>
    <!--====== EVENTS ======  -->
    <xsl:template name = "show-events">
        <xsl:if test = "../IMG">
            <xsl:apply-templates select = "../IMG"/>
        </xsl:if>
        <xsl:if test = "../NOTE">
            <xsl:apply-templates select = "../NOTE"/>
        </xsl:if>
        <xsl:for-each select = "../*">
           <xsl:sort select = "substring(DATE, string-length(DATE) - 3)"/>
            <xsl:variable name = "event-name">
                <xsl:apply-templates select = "." mode = "expand"/>
            </xsl:variable>
            <xsl:if test = "string($event-name)">
                <br/>
                <xsl:value-of select = "$event-name"/>
                <xsl:if test = "DATE">
                    <xsl:value-of select = "DATE"/>
                    <xsl:if test = "count(CONT) + count(NOTE) + count(PLAC)>0">,&#160;</xsl:if>
                </xsl:if>
                <xsl:if test = "PLAC">
                    <xsl:value-of select = "PLAC"/>
                    <xsl:if test = "count(NOTE) + count(CONT)>0">,&#160;</xsl:if>
                </xsl:if>
                <xsl:value-of select = "text()"/>
            </xsl:if>
        </xsl:for-each>
    </xsl:template>
    <xsl:template match = "BIRT" mode = "expand">b.&#160;</xsl:template>
    <xsl:template match = "DEAT" mode = "expand">d.&#160;</xsl:template>
    <xsl:template match = "EMIG" mode = "expand">&#160;</xsl:template>
    <xsl:template match = "BURI" mode = "expand">Burial</xsl:template>
    <xsl:template match = "BAPM" mode = "expand">Baptism</xsl:template>
    <xsl:template match = "MARR" mode = "expand">Marriage</xsl:template>

    <xsl:template match = "IMG">
       <br />
        <xsl:element name = "IMG">
            <xsl:attribute name = "SRC">
                <xsl:value-of select = "$img-path"/>
                <xsl:value-of select = "text()"/>
            </xsl:attribute>
        </xsl:element>
    </xsl:template>

    <xsl:template match = "NOTE">
	<br />
        <xsl:element name = "DIV">
	    <xsl:attribute name = "class">tooltip</xsl:attribute>
	    Note
 	    <xsl:element name = "SPAN">
		<xsl:attribute name = "class">tooltiptext</xsl:attribute>
	        <xsl:value-of select = "text()"/>
                <xsl:if test = "count(CONT)>0">&#160;</xsl:if>
                <xsl:if test = "CONT">
                    <xsl:apply-templates select = "CONT"/>
                </xsl:if>
            </xsl:element>
        </xsl:element>
    </xsl:template>

    <xsl:template match = "EVEN" mode = "expand">
        <br/>
        <xsl:value-of select = "TYPE"/>
        :
    </xsl:template>
    <xsl:template match = "*" mode = "expand"/>
    <xsl:template match = "CONT">
	&#160;<xsl:value-of select = "text()"/>
    </xsl:template>
    <!--====== STYLE ======  -->
    <xsl:template name = "css-style">
        <style type = "text/css">
BODY {
    background-color:
    white
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
    border-width: 0;   
    border-spacing: 1;
    border-color: lightgray;
    border-style: solid;
}

/* Tooltip container */
.tooltip {
    position: relative;
    display: inline-block;
    color: red;
    border-bottom: 1px dotted red; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    width: 500px ;
    background-color: white;
    color: black;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
    border-spacing: 1;
    border-color: lightgray;
    border-style: solid;
 
    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
}
        </style>
    </xsl:template>
</xsl:transform>
