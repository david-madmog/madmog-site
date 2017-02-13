<?xml version='1.0'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:template match="/">
  <table>
	<TR>
  <xsl:for-each select="classes/section">
  		<TD><TABLE>
  			<xsl:apply-templates select="address[position()=1]" />
  			<xsl:apply-templates select="class"/>
  		</TABLE></TD>
	</xsl:for-each>
	</TR></table>
</xsl:template>

<xsl:template match="class">
	<tr>
	  <xsl:apply-templates select="day" />
	  <xsl:apply-templates select="time" />
	  <xsl:apply-templates select="name" />
 	</tr>
</xsl:template>

<xsl:template match="address">
	<TR><TD COLSPAN="2"><xsl:value-of select="." /></TD></TR>
</xsl:template>	
		
<xsl:template match="day">
  <td>
			<xsl:value-of select="." />:
	</td>		
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
	
</xsl:stylesheet>

