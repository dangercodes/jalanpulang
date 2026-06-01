import React from 'react';
import { Text } from 'react-native';

// Professional Tajweed Color Palette
export const TAJWEED_COLORS: Record<string, string> = {
  'ghunnah': '#FF6B6B',           // Soft Red
  'idgham_ghunnah': '#FF9F43',    // Orange
  'idgham_no_ghunnah': '#54A0FF', // Sky Blue
  'iqlab': '#5F27CD',             // Purple
  'ikhfa': '#926247',             // Brown Primary
  'qalqalah': '#2E86DE',          // Strong Blue
  'madda_obligatory': '#EE5253',  // Dark Red
  'madda_permissible': '#FF9F43', // Orange
  'madda_necessity': '#EE5253',   // Dark Red
  'hamzat_wasl': '#8395A7',       // Gray
  'lam_jalalah': '#10AC84',       // Green
  'silent': '#8395A7',            // Gray
  'default': '#000000',           // Black
};

interface TajweedPart {
  text: string;
  rule: string | null;
}

/**
 * Parses a Tajweed-tagged string (from Quran.com) into an array of styled Text components.
 * Format: <tajweed class="rule_name">text</tajweed>
 */
export const parseTajweed = (htmlText: string, baseStyle: any = {}) => {
  const parts: TajweedPart[] = [];
  let currentIndex = 0;
  
  // Regex to find <tajweed class="rule">text</tajweed>
  const tagRegex = /<tajweed class="([^"]+)">([^<]+)<\/tajweed>/g;
  let match;

  while ((match = tagRegex.exec(htmlText)) !== null) {
    // Add text before the tag
    if (match.index > currentIndex) {
      parts.push({
        text: htmlText.substring(currentIndex, match.index),
        rule: null
      });
    }

    // Add the tagged part
    parts.push({
      text: match[2],
      rule: match[1]
    });

    currentIndex = tagRegex.lastIndex;
  }

  // Add remaining text
  if (currentIndex < htmlText.length) {
    parts.push({
      text: htmlText.substring(currentIndex),
      rule: null
    });
  }

  return parts.map((part, index) => (
    <Text 
      key={index} 
      style={[
        baseStyle, 
        { color: part.rule ? TAJWEED_COLORS[part.rule] || TAJWEED_COLORS.default : baseStyle.color || TAJWEED_COLORS.default }
      ]}
    >
      {decodeHtmlEntities(part.text)}
    </Text>
  ));
};

function decodeHtmlEntities(text: string) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”');
}
