import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import UserSearch from "../components/UserSearch";

test("renders search input", () => {
  render(<UserSearch />);
  const inputElement = screen.getByPlaceholderText(/search users/i);
  expect(inputElement).toBeInTheDocument();
});
