import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserSearch from "../components/UserSearch"; 

test("updates input value on change", () => {
  render(<UserSearch />);

  const inputElement = screen.getByPlaceholderText(/search users/i);

  fireEvent.change(inputElement, { target: { value: "new value" } });

  expect(inputElement.value).toBe("new value");
});
