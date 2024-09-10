import React from "react";
import { render, screen } from "@testing-library/react";
import UserSearch from "../components/UserSearch";

test("renders with no users initially", () => {
  render(<UserSearch />);

  const userElement = screen.queryByText(/user/i);
  expect(userElement).toBeNull();
});
