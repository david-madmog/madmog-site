<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:template match="/">
<HTML>
<HEAD>
<meta http-equiv="Content-Type"
 content="text/html; charset=iso-8859-1"/>
<xsl:comment>(C) David Poirier 2008</xsl:comment>
<title>Term Dates</title>
<link rel="stylesheet" href="fivesixseven.css" />
</HEAD>
<BODY>
  <xsl:for-each select="dates/section">
    <h2><xsl:value-of select="@title"/></h2>
      <xsl:if test="count(month/date) > 0">
		<p>(Cost this term: &#163;<xsl:value-of select="count(month/date) * 12" />)</p>
      </xsl:if>
		<table>  
		  <xsl:apply-templates select="*" />
		</table>
	</xsl:for-each>
</BODY>
</HTML>
</xsl:template>

<xsl:template match="month">
	<tr>
	  <td><xsl:value-of select="@name"/></td>
		<xsl:apply-templates select="*" />
	</tr>
</xsl:template>

<xsl:template match="date">
	<td>
	<xsl:value-of select="." />
	</td>
</xsl:template>	

<xsl:template match="text">
	<tr><td  colspan="4">
	<xsl:value-of select="." />
	</td></tr>
</xsl:template>	


<xsl:template match="recommences">
  <tr><td colspan="4">
	Recommences <xsl:value-of select="." />
	</td></tr>
</xsl:template>	

<xsl:template match="L">
  &#163;<xsl:value-of select="." />
</xsl:template>	
	
	
	
	
</xsl:stylesheet>

