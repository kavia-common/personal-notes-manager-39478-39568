import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders header brand", () => {
  render(<App />);
  const title = screen.getByText(/Personal Notes/i);
  expect(title).toBeInTheDocument();
});
