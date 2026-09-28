import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/discover")({
  component: Outlet,
});