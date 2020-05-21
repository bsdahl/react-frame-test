import React, { useContext } from 'react';
import Frame, { FrameContext } from 'react-frame-component';
import { StyleSheetManager, ThemeContext, ThemeProvider } from 'styled-components';

export const StyledFrame = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Frame {...otherProps}>
      <InjectFrameStyles>{props.children}</InjectFrameStyles>
    </Frame>
  );
};

const InjectFrameStyles = (props) => {
  const frameContext = useContext(FrameContext);
  // const theme = useContext(ThemeContext);

  return (
    <StyleSheetManager target={frameContext.document.head}>
      {/* <ThemeProvider theme={theme}>{props.children}</ThemeProvider> */}
      {props.children}
    </StyleSheetManager>
  );
};
