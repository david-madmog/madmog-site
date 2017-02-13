<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
 
<xsl:template match="/">
<HTML>
<HEAD>
<meta http-equiv="Content-Type"
 content="text/html; charset=iso-8859-1"/>
<xsl:comment>(C) David Poirier 2008</xsl:comment>
<title>Classes</title>
<link rel="stylesheet" href="fivesixseven.css" />
</HEAD>
<BODY>


  <xsl:for-each select="classes/section">
		<table>
			<tr><td>
				<xsl:value-of select="@title" />
			</td></tr>
			<tr><td><table>
			<xsl:apply-templates select="class"/>
			<xsl:apply-templates select="address[position()=1]" mode="A"/>
			<xsl:apply-templates select="address[position()>1]" mode="B"/>
			</table></td></tr><tr><td>
			<xsl:apply-templates select="map"/>
			</td></tr>
		</table>
		<hr />
	</xsl:for-each>



</BODY>
</HTML>
</xsl:template>

<xsl:template match="class">
	<tr>
	  <xsl:apply-templates />
 	</tr>
</xsl:template>

<xsl:template match="address" mode="A">
  <tr><td colspan="2">Address:</td>
	<td colspan="2">
	<xsl:value-of select="." />
	</td></tr>
</xsl:template>	
	
<xsl:template match="address" mode="B">
  <tr><td colspan="2"></td>
	<td colspan="2">
	<xsl:value-of select="." />
	</td></tr>
</xsl:template>	
	
<xsl:template match="map">
</xsl:template>	
	
<xsl:template match="day">
  <td></td>		
</xsl:template>	

<xsl:template match="time">
  <td>
			<xsl:value-of select="." />
	</td>		
</xsl:template>	
	
<xsl:template match="name">
  <td>
			<xsl:value-of select="." />
	</td>		
</xsl:template>	
	
<xsl:template match="cost">
  <td>
			(&#163;<xsl:value-of select="." />)
	</td>		
</xsl:template>	
	
	
</xsl:stylesheet>

