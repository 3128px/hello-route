import React from 'react';

import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  redirect,
  RouterContext,
} from "@tanstack/react-router";
import type { AuthContext as AuthContextType } from "./contexts/AuthContext";
import AuthContext, { AuthProvider } from "./contexts/AuthContext";

const routerContext = new RouterContext<{
  auth: AuthContextType;
}>();

// Create a root route
const rootRoute = routerContext.createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      <div>
        <Link to="/">Home</Link> <Link to="/login">Login</Link>{" "}
        <Link to="/ok">OK</Link>
      </div>
      <hr />
      <Outlet />
    </>
  );
}

const authenticatedRoute = new Route({
  id: "authenticated",
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    console.log(router.options.context);

    throw redirect({
      to: "/login",
      search: {
        // Use the current location to power a redirect after login
        // (Do not use `router.state.resolvedLocation` as it can
        // potentially lag behind the actual current location)
        redirect: router.state.location.href,
      },
    });
  },
});

const indexRoute = new Route({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: () => Index("home"),
});

const anotherRoute = new Route({
  getParentRoute: () => authenticatedRoute,
  path: "/ok",
  component: () => Index("ok"),
});

function Index(name: string) {
  return (
    <div>
      <h3>Welcome {name}</h3>
    </div>
  );
}

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

function Login() {
  return <div>Login!</div>;
}

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([indexRoute, anotherRoute]),
  loginRoute,
]);

// Create the router using your route tree
const router = new Router({ routeTree, context: { auth: undefined! } });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function useAuth() {
  return React.useContext(AuthContext);
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} context={{auth: useAuth()}} />
    </AuthProvider>
  );
}

export default App;
