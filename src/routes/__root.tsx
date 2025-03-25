import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <h1>デジクリ部員図鑑ジェネレータ</h1>
      <Outlet />
    </>
  ),
});
