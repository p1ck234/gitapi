import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserSearch from "../components/UserSearch";

test("Previous button is disabled on first page", () => {
  render(<UserSearch />);

  const prevButton = screen.getByText(/Previous/i);
  expect(prevButton).toBeDisabled();
});
