import Head from 'next/head';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'styles';

interface Props {
  children: ReactNode;
}

const Layout = (props: Props) => {
  const { children } = props;

  return (
    <>
      <Head>
        <title>Hello World</title>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
        <meta key="robots" name="robots" content="index, follow" />
      </Head>

      <ThemeProvider theme={theme}>
        <div>{children}</div>
      </ThemeProvider>
    </>
  );
};

export default Layout;
