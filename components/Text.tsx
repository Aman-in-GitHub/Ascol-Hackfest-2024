import { Text as RnText, TextStyle } from 'react-native';
import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

function Text({
  children,
  isWhite,
  isBold,
  style,
  numberOfLines
}: {
  children: React.ReactNode;
  isWhite?: boolean;
  isBold?: boolean;
  style?: TextStyle;
  numberOfLines?: number;
}) {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <RnText
      style={[
        styles.textStyle,
        {
          color: isWhite ? theme.colors.whiteColor : styles.textStyle.color,
          fontFamily: isBold ? 'BoldBodyTextFont' : 'BodyTextFont'
        },
        style
      ]}
      adjustsFontSizeToFit={true}
      numberOfLines={numberOfLines}
    >
      {children}
    </RnText>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  textStyle: {
    color: theme.colors.typography,
    fontFamily: 'BodyTextFont',
    fontSize: theme.fontSize.original
  }
}));

export default Text;
