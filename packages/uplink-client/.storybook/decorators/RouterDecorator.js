import { useRouter as nextUseRouter, NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';


const createMockRouter = () => {
  const push = async () => true;
  const replace = async () => true;
  const reload = () => { };
  const back = () => { };
  const prefetch = async () => undefined;
  const beforePopState = () => { };
  const events = {
    on: () => { },
    off: () => { },
    emit: () => { },
  };

  return {
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push,
    replace,
    reload,
    back,
    prefetch,
    beforePopState,
    isFallback: false,
    isReady: true,
    isPreview: false,
    isLocaleDomain: false,
    events,
    isSsr: false,
    locale: 'en',
    locales: ['en'],
    defaultLocale: 'en',
    domainLocales: [],
  };
};

export function withMockedRouter() {
  const mockRouter = createMockRouter();

  return function WithMockedRouter({ children }) {
    return <RouterContext.Provider value={mockRouter}>{children}</RouterContext.Provider>;
  };
}
